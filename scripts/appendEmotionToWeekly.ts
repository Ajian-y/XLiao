import fs from 'fs';
import path from 'path';

// 定义类型
type EmotionType = '开心' | '平静' | '焦虑' | '难过' | '愤怒' | '疲惫';
type EmotionStrength = Record<EmotionType, number>;
interface DailyEmotion {
  date: string;
  dominantEmotion: EmotionType;
  emotionStrength: EmotionStrength;
  topEmotions: { type: EmotionType; percent: number }[];
  mainPeriods: string[];
  mainTopics: string[];
}

const filePath = path.resolve(__dirname, '../src/data/weeklyEmotionData.ts');

// 1. 校验参数+解析新数据
if (!process.argv[2]) {
  console.error('请传入base64编码的情绪JSON！');
  process.exit(1);
}
let newEmotion: EmotionStrength = { 开心:0, 平静:0, 焦虑:0, 难过:0, 愤怒:0, 疲惫:0 };
try {
  const jsonStr = Buffer.from(process.argv[2], 'base64').toString('utf-8');
  Object.assign(newEmotion, JSON.parse(jsonStr));
} catch (e) {
  console.error('JSON解析失败：', e);
  process.exit(1);
}
const dateStr = new Date().toISOString().slice(0, 10);

// 2. 核心步骤：读取文件并结构化处理daily数组（保证顺序）
const content = fs.readFileSync(filePath, 'utf-8');

// 步骤1：暴力提取daily数组内的所有内容（不管格式）
const dailyMatch = content.match(/daily:\s*\[\s*([\s\S]*?)\s*\]/);
if (!dailyMatch) {
  console.error('未找到daily数组！');
  process.exit(1);
}
let dailyRaw = dailyMatch[1];

// 步骤2：提取所有有效的DailyEmotion（严格保留原文件顺序）
const allItems: DailyEmotion[] = [];
// 按原文件顺序匹配条目（关键：exec循环，保证顺序）
const itemRegex = /\{[\s\S]*?date:\s*'[^']+?'[\s\S]*?\}/g;
let match: RegExpExecArray | null;
while ((match = itemRegex.exec(dailyRaw)) !== null) {
  const itemStr = match[0];
  try {
    const dateMatch = itemStr.match(/date:\s*'([^']+)'/);
    const strengthMatch = itemStr.match(/emotionStrength:\s*({[^{}]*})/);
    if (!dateMatch || !strengthMatch) continue;

    const date = dateMatch[1];
    const emotionStrength = JSON.parse(strengthMatch[1]) as EmotionStrength;
    const dominantEmotion = Object.entries(emotionStrength).sort((a,b)=>b[1]-a[1])[0][0] as EmotionType;
    const topEmotions = Object.entries(emotionStrength)
      .filter(([,v])=>v>0)
      .sort((a,b)=>b[1]-a[1])
      .slice(0,2)
      .map(([type, percent])=>({type: type as EmotionType, percent}));

    allItems.push({
      date,
      dominantEmotion,
      emotionStrength,
      topEmotions,
      mainPeriods: [],
      mainTopics: []
    });
  } catch (e) {
    continue; // 跳过解析失败的残缺条目
  }
}

// 步骤3：分离「当天条目」和「历史条目」（历史条目保留原顺序）
const historyItems = allItems.filter(item => item.date !== dateStr); // 原顺序保留
const todayOldItems = allItems.filter(item => item.date === dateStr);

// 计算平均值
let finalEmotion = { ...newEmotion };
if (todayOldItems.length > 0) {
  console.log(`找到${todayOldItems.length}条当天旧数据，计算平均值`);
  const oldEmotion = todayOldItems[0].emotionStrength;
  const types: EmotionType[] = ['开心', '平静', '焦虑', '难过', '愤怒', '疲惫'];
  types.forEach(type => {
    finalEmotion[type] = Math.round((oldEmotion[type] + newEmotion[type]) / 2);
  });
}

// 步骤4：生成当天新条目
const newItem: DailyEmotion = {
  date: dateStr,
  dominantEmotion: Object.entries(finalEmotion).sort((a,b)=>b[1]-a[1])[0][0] as EmotionType,
  emotionStrength: finalEmotion,
  topEmotions: Object.entries(finalEmotion)
    .filter(([,v])=>v>0)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,2)
    .map(([type, percent])=>({type: type as EmotionType, percent})),
  mainPeriods: [],
  mainTopics: []
};

// 步骤5：重构daily数组（关键：历史数据(原顺序) + 新数据 → 新数据必在最后）
const finalItems = [...historyItems, newItem]; 

// 步骤6：将结构化数据转回TS字符串
const itemToStr = (item: DailyEmotion) => `    {
      date: '${item.date}',
      dominantEmotion: '${item.dominantEmotion}',
      emotionStrength: ${JSON.stringify(item.emotionStrength)},
      topEmotions: ${JSON.stringify(item.topEmotions)},
      mainPeriods: [],
      mainTopics: []
    }`;
const finalDailyStr = finalItems.map(itemToStr).join(',\n');

// 步骤7：替换原文件的daily数组
let newContent = content.replace(
  /daily:\s*\[\s*([\s\S]*?)\s*\]/,
  `daily: [
${finalDailyStr}
  ]`
);

// 精准定向删除指定4行
const targetLinesRegex = /^\s*mainPeriods:\s*\[\s*\],\s*\n^\s*mainTopics:\s*\[\s*\]\s*\n^\s*\}\s*\n^\s*\],?\s*$/gm;
newContent = newContent.replace(targetLinesRegex, '');
// 兜底清理空行
newContent = newContent.replace(/\n\s*\n/g, '\n');

// 写入文件
fs.writeFileSync(filePath, newContent, 'utf-8');

