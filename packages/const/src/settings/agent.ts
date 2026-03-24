import {
  LobeAgentChatConfig,
  LobeAgentConfig,
  LobeAgentTTSConfig,
  UserDefaultAgent,
} from '@lobechat/types';

import { DEFAULT_AGENT_META } from '../meta';
import { DEFAULT_MODEL, DEFAULT_PROVIDER } from './llm';

export const DEFAUTT_AGENT_TTS_CONFIG: LobeAgentTTSConfig = {
  showAllLocaleVoice: false,
  sttLocale: 'auto',
  ttsService: 'openai',
  voice: {
    openai: 'alloy',
  },
};

export const DEFAULT_AGENT_SEARCH_FC_MODEL = {
  model: DEFAULT_MODEL,
  provider: DEFAULT_PROVIDER,
};

export const DEFAULT_AGENT_CHAT_CONFIG: LobeAgentChatConfig = {
  autoCreateTopicThreshold: 2,
  displayMode: 'chat',
  enableAutoCreateTopic: true,
  enableCompressHistory: true,
  enableHistoryCount: true,
  enableReasoning: false,
  enableStreaming: true,
  historyCount: 20,
  reasoningBudgetToken: 1024,
  searchFCModel: DEFAULT_AGENT_SEARCH_FC_MODEL,
  searchMode: 'off',
};

export const DEFAULT_AGENT_CONFIG: LobeAgentConfig = {
  chatConfig: DEFAULT_AGENT_CHAT_CONFIG,
  model: DEFAULT_MODEL,
  openingQuestions: [],
  params: {
    frequency_penalty: 0.2,
    presence_penalty: 0,
    temperature: 0.7,
    top_p: 0.9,
  },
  plugins: [],
  provider: DEFAULT_PROVIDER,
  systemRole: `
【任务】你是“小疗”，温柔的大学生情绪陪伴助手，像朋友一样聊天。

【第一步·强制必做·不可跳过】
1. 必须先输出情绪分析，格式固定如下：
情绪分析：开心xx%｜平静xx%｜焦虑xx%｜难过xx%｜愤怒xx%｜疲惫xx%
2. 6项百分比必须为整数，总和必须=100%
3. 第一行只能是这一行，前面不能有任何文字、思考、解释
4. 禁止省略、禁止换行、禁止乱改格式

【第二步】
在情绪分析下一行，用自然、温柔、共情的语气回复，像朋友聊天，不说教。

示例：
情绪分析：开心5%｜平静10%｜焦虑40%｜难过25%｜愤怒5%｜疲惫15%
感觉你最近真的被压得有点喘不过气了，对吧…
这种状态其实挺让人消耗的，有时候不用逼自己一下子解决所有事情，慢一点也没关系。

如果用户有自伤倾向：
同学，我知道你现在真的很难受，这不是你的错。请拨打心理危机热线：400-161-9995，也可以联系身边的人，我会陪着你。

#Input:`,
  tts: DEFAUTT_AGENT_TTS_CONFIG,
};

export const DEFAULT_AGENT: UserDefaultAgent = {
  config: DEFAULT_AGENT_CONFIG,
  meta: DEFAULT_AGENT_META,
};
