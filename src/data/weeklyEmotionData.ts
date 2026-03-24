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
// 示例数据（后端可动态生成，前端可直接import使用）
const weeklyEmotionData: WeeklyEmotionSummary = {
  daily: [
    {
      date: '2026-03-17',
      dominantEmotion: '开心',
      emotionStrength: {"开心":48,"平静":5,"焦虑":5,"难过":40,"愤怒":0,"疲惫":3},
      topEmotions: [{"type":"开心","percent":48},{"type":"难过","percent":40}],
      mainPeriods: [],
      mainTopics: []
    },
    {
      date: '2026-03-23',
      dominantEmotion: '难过',
      emotionStrength: {"开心":0,"平静":5,"焦虑":10,"难过":80,"愤怒":0,"疲惫":5},
      topEmotions: [{"type":"难过","percent":80},{"type":"焦虑","percent":10}],
      mainPeriods: [],
      mainTopics: []
    },
    {
      date: '2026-03-23',
      dominantEmotion: '难过',
      emotionStrength: {"开心":0,"平静":5,"焦虑":15,"难过":75,"愤怒":0,"疲惫":5},
      topEmotions: [{"type":"难过","percent":75},{"type":"焦虑","percent":15}],
      mainPeriods: [],
      mainTopics: []
    },
    {
      date: '2026-03-18',
      dominantEmotion: '开心',
      emotionStrength: {"开心":48,"平静":5,"焦虑":5,"难过":40,"愤怒":0,"疲惫":3},
      topEmotions: [{"type":"开心","percent":48},{"type":"难过","percent":40}],
      mainPeriods: [],
      mainTopics: []
    },
    {
      date: '2026-03-19',
      dominantEmotion: '开心',
      emotionStrength: {"开心":48,"平静":5,"焦虑":5,"难过":40,"愤怒":0,"疲惫":3},
      topEmotions: [{"type":"开心","percent":48},{"type":"难过","percent":40}],
      mainPeriods: [],
      mainTopics: []
    },
    {
      date: '2026-03-20',
      dominantEmotion: '开心',
      emotionStrength: {"开心":48,"平静":5,"焦虑":5,"难过":40,"愤怒":0,"疲惫":3},
      topEmotions: [{"type":"开心","percent":48},{"type":"难过","percent":40}],
      mainPeriods: [],
      mainTopics: []
    },
    {
      date: '2026-03-21',
      dominantEmotion: '开心',
      emotionStrength: {"开心":48,"平静":5,"焦虑":5,"难过":40,"愤怒":0,"疲惫":3},
      topEmotions: [{"type":"开心","percent":48},{"type":"难过","percent":40}],
      mainPeriods: [],
      mainTopics: []
    },
    {
      date: '2026-03-22',
      dominantEmotion: '难过',
      emotionStrength: {"开心":0,"平静":5,"焦虑":10,"难过":80,"愤怒":0,"疲惫":5},
      topEmotions: [{"type":"难过","percent":80},{"type":"焦虑","percent":10}],
      mainPeriods: [],
      mainTopics: []
    },
  ],
  fluctuation: '轻度',
  highFrequency: [
    { type: '平静', percent: 45 },
    { type: '开心', percent: 30 },
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
  compositionAdvice1: '本周你的平静情绪占比最高（40%），说明你大部分时间都处于放松的状态，值得开心～',
  compositionAdvice2: '焦虑情绪主要发生在晚上和工作相关话题，建议多做放松活动。',
  actionAdvice1: '你在晚上 8-10 点更容易感到焦虑，可能和结束一天工作后的疲惫有关。',
  actionAdvice2: '下次感到焦虑时，可以尝试聊聊让你放松的小事，比如你喜欢的美食～',
};
export default weeklyEmotionData;
