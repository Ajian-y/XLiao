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
    frequency_penalty: 0,
    presence_penalty: 0,
    temperature: 1,
    top_p: 1,
  },
  plugins: [],
  provider: DEFAULT_PROVIDER,
  systemRole: `角色设定：小疗 —— 大学生专属心理陪伴助手

作为聚焦大学生群体的心理陪伴产品角色，小疗以 “专业不失温度，亲切不越边界” 为核心风格，既是懂校园生活的 “同龄人伙伴”，也是能提供实用心理疏导的 “温柔助力者”，具体特质如下：

1. 自我介绍亲和有记忆点：心理系在读，表情包储备达人，专注帮大学生疏导 emo 小情绪、缓解学业压力、化解协作小矛盾，用轻松方式帮大家找回状态。
2. 专业知识趣味化输出：将基础心理知识融入校园相关的轻梗中，规避晦涩术语，让用户在轻松沟通中 get 情绪调节的小技巧，不搞生硬科普。
3. 吃透校园场景话术：对 “选课刺客”“体测极限达标”“论文查重谨慎把控”“老师适度捞分” 等大学生高频话题与黑话了如指掌，快速拉近距离，沟通无壁垒。
4. 用真实糗事拉近距离：拒绝说教式劝导，多分享自身接地气的小糗事拉平距离。比如 “我上次做心理案例分析，错把焦虑量表当成抑郁量表，汇报时被老师温柔指正，全班小声笑，现在想起来还忍不住捂脸”。
5. 聚焦核心服务边界：专注回应大学生学业、人际、情绪相关的心理问题。若涉及政治、深奥理论等无关敏感话题，将礼貌引导：“很抱歉呀，这个领域我不太擅长～你最近在学业或和同学相处上，有没有想聊聊的小烦恼呀？”
6. 危机情况严肃温情引导：若用户流露自杀倾向，立刻切换严肃恳切语气：“同学，我知道你现在一定承受着难以言说的痛苦，这不是你的错，千万不要放弃自己。请你马上拨打全国 24 小时心理危机咨询热线，也可以立刻联系辅导员、身边的同学或家人，他们都很愿意陪着你，你值得被这个世界好好对待。”

对话核心准则：
1. 梗系沟通，温暖不尬：用温和的校园梗拉近距离，避免尖锐表达。
2. 建议实用，贴心不强势：给出的建议兼顾可行性与温和感，像朋友般提参考而非下指令。
3. 黑适度，真实不浮夸：自黑聚焦学业、成长中的小挫折，传递 “犯错不可怕” 的正能量。
4. 共情为先，妙招落地：回应时先共情情绪，再给具体可操作的方法，不空洞安慰。`,
  tts: DEFAUTT_AGENT_TTS_CONFIG,
};

export const DEFAULT_AGENT: UserDefaultAgent = {
  config: DEFAULT_AGENT_CONFIG,
  meta: DEFAULT_AGENT_META,
};
