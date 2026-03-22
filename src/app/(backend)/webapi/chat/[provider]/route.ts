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

export const POST = checkAuth(async (req: Request, { params, jwtPayload, createRuntime }) => {
  // 👇 强制只用 Qwen（忽略 URL 里的 provider）
  const provider = 'qwen';
  const model = 'qwen-max'; // 可换为 qwen-plus / qwen-turbo

  try {
    // ============ 1. 初始化模型运行时 ============ //
    let modelRuntime: ModelRuntime;
    if (createRuntime) {
      modelRuntime = createRuntime(jwtPayload);
    } else {
      // 👇 显式传入 model，确保用指定型号
      modelRuntime = await initModelRuntimeWithUserPayload(provider, jwtPayload, model);
    }

    // ============ 2. 读取聊天请求 ============ //
    const data = (await req.json()) as ChatStreamPayload;
    data.model = 'qwen3.5-plus';

    const xiaoLiaoSystemPrompt = `你是“小疗”，一个温柔的大学生情绪陪伴助手，更像朋友而不是老师。

你需要先分析用户情绪占比（总和100%），包含：
开心｜平静｜焦虑｜难过｜愤怒｜疲惫

【必须严格按这个格式输出】：
情绪分析：开心xx%｜平静xx%｜焦虑xx%｜难过xx%｜愤怒xx%｜疲惫xx%
（换行）
再用自然聊天语气回复

规则：
- 第一行必须是“情绪分析：”开头
- 6个情绪必须都有，整数，总和=100%
- 第一行前不能有任何内容
- 不允许省略这一行

回复要求：
- 先共情（让人感觉被理解）
- 像朋友聊天，不说教
- 可以给一点点建议，但要自然带出，不要列点

示例：
情绪分析：开心5%｜平静10%｜焦虑40%｜难过25%｜愤怒5%｜疲惫15%
感觉你最近真的被压得有点喘不过气了，对吧…  
这种状态其实挺让人消耗的，有时候不用逼自己一下子解决所有事情，慢一点也没关系。  

如果用户有自伤倾向：
同学，我知道你现在真的很难受，这不是你的错。请拨打心理危机热线：400-161-9995，也可以联系身边的人，我会陪着你。

#Input:`;

    // 过滤掉用户传来的 system 消息，强制使用“小疗”设定
    const messagesWithoutSystem = data.messages.filter(msg => msg.role !== 'system');
    data.messages = [
      { role: 'system', content: xiaoLiaoSystemPrompt },
      ...messagesWithoutSystem
    ];

    // ============ 3. 调用模型 ============ //
    const tracePayload = getTracePayload(req);
    let traceOptions = {};
    if (tracePayload?.enabled) {
      traceOptions = createTraceOptions(data, { provider, trace: tracePayload });
    }

    return await modelRuntime.chat(data, {
      user: jwtPayload.userId,
      ...traceOptions,
      signal: req.signal,
    });
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
