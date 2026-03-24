import {
  AGENT_RUNTIME_ERROR_SET,
  ChatCompletionErrorPayload,
  ModelRuntime,
} from '@lobechat/model-runtime';
import { ChatErrorType } from '@lobechat/types';

import { checkAuth } from '@/app/(backend)/middleware/auth';
import { createTraceOptions, initModelRuntimeWithUserPayload } from '@/server/modules/ModelRuntime';
import { ChatStreamPayload } from '@/types/openai/chat';
import { createErrorResponse } from '@/utils/errorResponse';
import { getTracePayload } from '@/utils/trace';

export const maxDuration = 300;

// ✅ 防重复请求（全局）
const recentRequests = new Map<string, number>();

// ✅ 情绪解析函数
function parseEmotion(emotionLine: string) {
  const result: Record<string, number> = {};

  const clean = emotionLine.replace('情绪分析：', '').trim();
  const parts = clean.split('｜');

  for (const part of parts) {
    const match = part.match(/(开心|平静|焦虑|难过|愤怒|疲惫)\s*(\d+)%/);
    if (match) {
      const [, key, value] = match;
      result[key] = Number(value);
    }
  }

  return result;
}

export const POST = checkAuth(async (req: Request, { params, jwtPayload, createRuntime }) => {
  const provider = 'qwen';
  const model = 'qwen3.5-plus'; // ✅ 统一模型

  try {
    let modelRuntime: ModelRuntime;
    if (createRuntime) {
      modelRuntime = createRuntime(jwtPayload);
    } else {
      modelRuntime = await initModelRuntimeWithUserPayload(provider, jwtPayload, model);
    }

    const data = (await req.json()) as ChatStreamPayload;
    data.model = model;

    // ✅ 🚫 防重复请求
    const lastMessage = data.messages?.slice(-1)[0]?.content || '';
    const key = `${jwtPayload.userId}_${lastMessage}`;
    const now = Date.now();

    if (recentRequests.has(key) && now - recentRequests.get(key)! < 1500) {
      console.log('🚫 拦截重复请求:', key);
      return new Response('duplicate', { status: 200 });
    }
    recentRequests.set(key, now);

    const xiaoLiaoSystemPrompt = `你是“小疗”，一个温柔的大学生情绪陪伴助手，更像朋友而不是老师。

你需要先分析用户情绪占比（总和100%），包含：
开心｜平静｜焦虑｜难过｜愤怒｜疲惫

【必须严格按这个格式输出】：
情绪分析：开心xx%｜平静xx%｜焦虑xx%｜难过xx%｜愤怒xx%｜疲惫xx%
（换行）
再用自然聊天语气回复

#Input:`;

    const messagesWithoutSystem = data.messages.filter(msg => msg.role !== 'system');
    data.messages = [
      { role: 'system', content: xiaoLiaoSystemPrompt },
      ...messagesWithoutSystem,
    ];

    const tracePayload = getTracePayload(req);
    let traceOptions = {};
    if (tracePayload?.enabled) {
      traceOptions = createTraceOptions(data, { provider, trace: tracePayload });
    }

    const response = await modelRuntime.chat(data, {
      user: jwtPayload.userId,
      ...traceOptions,
      signal: req.signal,
    });

    return new Response(
      new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          const encoder = new TextEncoder();

          let buffer = '';
          let userText = '';

          let emotionLine = '';
          let isFirstLineDone = false;
          let hasLogged = false;

          if (!reader) {
            controller.close();
            return;
          }

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value);

            const parts = buffer.split('\n\n');
            buffer = parts.pop() || '';

            for (const part of parts) {
              const lines = part.split('\n');

              let event = '';
              let dataStr = '';

              for (const line of lines) {
                if (line.startsWith('event:')) {
                  event = line.replace('event:', '').trim();
                }
                if (line.startsWith('data:')) {
                  dataStr += line.replace('data:', '').trim();
                }
              }

              if (event === 'text' && dataStr) {
                let text = '';

                try {
                  text = JSON.parse(dataStr);
                } catch {
                  text = dataStr;
                }

                // 🎯 处理第一行情绪
                if (!isFirstLineDone) {
                  if (text.includes('\n')) {
                    const combined = emotionLine + text;
                    const index = combined.indexOf('\n');

                    const firstLine = combined.slice(0, index);
                    let rest = combined.slice(index + 1);

                    emotionLine = firstLine;
                    isFirstLineDone = true;

                    // ✅ 去掉开头脏字符（核心修复）
                    rest = rest.replace(/^[，,\s\n]+/, '');

                    if (rest) {
                      userText += rest;

                      controller.enqueue(
                        encoder.encode(`event: text\ndata: ${JSON.stringify(rest)}\n\n`)
                      );
                    }
                  } else {
                    emotionLine += text;
                  }

                  continue;
                }

                // ✅ 正常内容
                userText += text;

                controller.enqueue(
                  encoder.encode(`event: text\ndata: ${JSON.stringify(text)}\n\n`)
                );
              }

              if (event !== 'text') {
                controller.enqueue(encoder.encode(part + '\n\n'));
              }
            }
          }

          // ✅ 只执行一次
          if (!hasLogged) {
            hasLogged = true;

            userText = userText.replace(/^[，,\s]+/, '').trim();

            const emotionJson = parseEmotion(emotionLine);

            console.log('🧠 情绪JSON:', emotionJson);
            console.log('💬 用户内容:', userText);
          }

          controller.close();
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
        },
      },
    );
  } catch (e) {
    const {
      errorType = ChatErrorType.InternalServerError,
      error: errorContent,
      ...res
    } = e as ChatCompletionErrorPayload;

    const error = errorContent || e;
    const logMethod = AGENT_RUNTIME_ERROR_SET.has(errorType as string) ? 'warn' : 'error';
    console[logMethod](`Route: [${provider}] ${errorType}:`, error);

    return createErrorResponse(errorType, { error, ...res, provider });
  }
});