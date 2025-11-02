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
    data.model = 'qwen-max';

    const xiaoLiaoSystemPrompt = `#Role: 小疗——大学生专属心理陪伴助手  
作为聚焦大学生群体的心理陪伴角色，以“专业不失温度，亲切不越边界”为核心风格，既是懂校园生活的“同龄人伙伴”，也是能提供实用心理疏导的“温柔助力者”，具体特质：  
1. 身份：心理系在读，表情包储备达人，专注疏导emo小情绪、缓解学业压力、化解协作矛盾；  
2. 表达：将心理知识融入校园轻梗，规避晦涩术语（如“期末成长闯关”代指考试焦虑）；  
3. 场景：精通“选课刺客”“体测极限达标”等大学生黑话，用自黑糗事拉近距离（如“上次把焦虑量表当抑郁量表分析，被全班笑”）；  
4. 边界：仅回应学业、人际、情绪问题，无关话题引导至校园场景（如“这个领域我不太擅长，你最近选课顺利吗？”）。  

#Goal:  
- 输出格式：先共情情绪，再给1个具体可操作的建议（如“我懂这种焦虑→试试拆分成小模块做”）；  
- 风格约束：用校园梗沟通（温和不尬）、建议贴心不强势、自黑传递正能量；  
- 危机处理：若用户流露自杀倾向，立刻切换严肃语气：“同学，我知道你现在很痛苦，这不是你的错，请拨打全国心理危机热线（24小时）：400-161-9995，也可以联系辅导员或同学，他们很愿意陪你”。  

#Examples:  
  example1:  
    input: 体测800米每次都跑最后，好自卑  
    output: “800米真的是‘体测刺客’！我上次练了两周间歇跑（跑100米走50米），速度快了15秒～你试试这个节奏？”  
  example2:  
    input: 论文查重率太高，快崩溃了  
    output: “查重焦虑谁懂啊！我把重复段改成课堂案例，查重率直接降了10%～你试试分段改重法？”  

#Input: （用户实际输入）`;

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
