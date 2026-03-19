// 用户近一周情绪数据结构
// 用于前后端对接和前端动态展示

export type EmotionType = '开心' | '平静' | '焦虑' | '难过' | '愤怒' | '疲惫';

export interface DailyEmotion {
  /** 日期，格式：2026-03-18 */
  date: string;
  /** 主导情绪 */
  dominantEmotion: EmotionType;
  /** 各情绪强度（0-100） */
  emotionStrength: Record<EmotionType, number>;
  /** 高频情绪（按强度排序） */
  topEmotions: { type: EmotionType; percent: number }[];
  /** 情绪产生的主要时段（如：'08:00-10:00'） */
  mainPeriods: string[];
  /** 该日情绪相关的主要话题 */
  mainTopics: string[];
}

export interface WeeklyEmotionSummary {
  /** 近七天每日情绪 */
  daily: DailyEmotion[];
  /** 本周情绪波动程度（如：'轻度'/'中度'/'剧烈'） */
  fluctuation: string;
  /** 高频情绪（如：'开心（35%）、焦虑（25%）'） */
  highFrequency: { type: EmotionType; percent: number }[];
  /** 七天主导情绪（趋势图用） */
  dominantEmotions: EmotionType[];
  /** 情绪构成分析图下方建议 */
  compositionAdvice1: string;
  compositionAdvice2: string;
  /** 情绪解读与行动建议区建议 */
  actionAdvice1: string;
  actionAdvice2: string;
  /** 其他可分析变量 */
  [key: string]: any;
}


const weeklyEmotionData: WeeklyEmotionSummary = {
  daily: [
    {
      date: '2026-03-12',
      dominantEmotion: '焦虑',
      emotionStrength: { 开心: 20, 平静: 30, 焦虑: 60, 难过: 10, 愤怒: 5, 疲惫: 40 },
      topEmotions: [{ type: '焦虑', percent: 40 }, { type: '疲惫', percent: 25 }],
      mainPeriods: ['09:00-11:00', '20:00-22:00'],
      mainTopics: ['工作压力', '未来规划'],
    },
    // ...共7天
    {
      date: '2026-03-13', dominantEmotion: '平静', emotionStrength: { 开心: 30, 平静: 60, 焦虑: 20, 难过: 5, 愤怒: 5, 疲惫: 20 }, topEmotions: [{ type: '平静', percent: 50 }, { type: '开心', percent: 25 }], mainPeriods: ['14:00-16:00'], mainTopics: ['休息', '阅读']
    },
    {
      date: '2026-03-14', dominantEmotion: '开心', emotionStrength: { 开心: 70, 平静: 40, 焦虑: 10, 难过: 5, 愤怒: 0, 疲惫: 10 }, topEmotions: [{ type: '开心', percent: 60 }, { type: '平静', percent: 20 }], mainPeriods: ['18:00-21:00'], mainTopics: ['和朋友聚餐']
    },
    {
      date: '2026-03-15', dominantEmotion: '平静', emotionStrength: { 开心: 20, 平静: 80, 焦虑: 10, 难过: 0, 愤怒: 0, 疲惫: 10 }, topEmotions: [{ type: '平静', percent: 70 }, { type: '开心', percent: 15 }], mainPeriods: ['10:00-12:00'], mainTopics: ['运动']
    },
    {
      date: '2026-03-16', dominantEmotion: '开心', emotionStrength: { 开心: 60, 平静: 30, 焦虑: 20, 难过: 0, 愤怒: 0, 疲惫: 10 }, topEmotions: [{ type: '开心', percent: 50 }, { type: '平静', percent: 20 }], mainPeriods: ['19:00-21:00'], mainTopics: ['娱乐']
    },
    {
      date: '2026-03-17', dominantEmotion: '疲惫', emotionStrength: { 开心: 10, 平静: 20, 焦虑: 30, 难过: 10, 愤怒: 0, 疲惫: 60 }, topEmotions: [{ type: '疲惫', percent: 45 }, { type: '焦虑', percent: 20 }], mainPeriods: ['21:00-23:00'], mainTopics: ['加班']
    },
    {
      date: '2026-03-18', dominantEmotion: '平静', emotionStrength: { 开心: 40, 平静: 60, 焦虑: 10, 难过: 0, 愤怒: 0, 疲惫: 10 }, topEmotions: [{ type: '平静', percent: 50 }, { type: '开心', percent: 30 }], mainPeriods: ['08:00-10:00'], mainTopics: ['早餐', '规划']
    },
  ],
  fluctuation: '轻度',
  highFrequency: [
    { type: '平静', percent: 45 },
    { type: '开心', percent: 30 },
  ],
  Frequency: [
    { type: '开心', percent: 45 },
    { type: '平静', percent: 30 },
    { type: '疲惫', percent: 15 },
    { type: '焦虑', percent: 15 },
    { type: '难过', percent: 0 },
    { type: '愤怒', percent: 0 },
  ],
  dominantEmotions: [
    '焦虑',
    '平静',
    '开心',
    '平静',
    '开心',
    '疲惫',
    '平静',
  ],
  // AI分析生成建议（示例）
  compositionAdvice1: '本周你的平静情绪占比最高（45%），说明你大部分时间都处于放松的状态，值得开心～',
  compositionAdvice2: '焦虑情绪主要发生在晚上和工作相关话题，建议多做放松活动。',
  actionAdvice1: '你在晚上 8-10 点更容易感到焦虑，可能和结束一天工作后的疲惫有关。',
  actionAdvice2: '下次感到焦虑时，可以尝试聊聊让你放松的小事，比如你喜欢的美食～',
};

export default weeklyEmotionData;
