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
  const model = 'qwen-max';

  try {
    let modelRuntime: ModelRuntime;
    if (createRuntime) {
      modelRuntime = createRuntime(jwtPayload);
    } else {
      modelRuntime = await initModelRuntimeWithUserPayload(provider, jwtPayload, model);
    }

    const data = (await req.json()) as ChatStreamPayload;
    data.model = 'qwen3.5-plus';

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
          let fullText = '';
          let userText = '';

          let emotionLine = '';
          let isFirstLineDone = false;

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

                fullText += text;

                // 🎯 处理第一行情绪
                if (!isFirstLineDone) {
                  if (text.includes('\n')) {
                    const [firstLine, rest] = (emotionLine + text).split('\n');

                    emotionLine = firstLine;
                    isFirstLineDone = true;

                    // ✅ 剩余内容才给用户
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

              // 透传其他事件
              if (event !== 'text') {
                controller.enqueue(encoder.encode(part + '\n\n'));
              }
            }
          }

          // =========================
          // ✅ 流结束后统一处理（只执行一次）
          // =========================

          const emotionJson = parseEmotion(emotionLine);

          console.log('🧠 情绪JSON:', emotionJson);
          console.log('💬 用户内容:', userText);

          // 👉 这里可以存数据库
          // await saveToDB({
          //   userId: jwtPayload.userId,
          //   emotion: emotionJson,
          //   content: userText,
          // });

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