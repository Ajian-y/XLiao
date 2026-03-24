"use client";
import { Card, Typography, Button, Skeleton } from 'antd';
import { Line, Pie } from '@ant-design/charts';
import { memo, useState } from 'react';
import weeklyEmotionData from '@/data/weeklyEmotionData';
import { Flexbox } from 'react-layout-kit';
import styled from '@emotion/styled';

const { Title, Paragraph } = Typography;

const GradientBackground = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: var(--left-menu-width, 72px);
  right: 0;
  background: linear-gradient(135deg, #FCFCFC 0%, #FFE8B8 40%, #B8E8C8 100%);
  padding: 24px;
  overflow: auto;
  z-index: 10;
  &::before {
    content: '';
    position: absolute;
    left: 10%;
    top: 10%;
    width: 180px;
    height: 180px;
    background: radial-gradient(circle, #FFE8B8 0%, #fff0 80%);
    opacity: 0.5;
    border-radius: 50%;
    z-index: 0;
  }
  &::after {
    content: '';
    position: absolute;
    right: 8%;
    bottom: 8%;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, #B8E8C8 0%, #fff0 80%);
    opacity: 0.4;
    border-radius: 50%;
    z-index: 0;
  }
`;

const Section = styled(Card)`
  background: #fff;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(220,220,220,0.08);
`;

const CapsuleButton = styled(Button)`
  border-radius: 24px;
  padding: 0 20px;
  height: 36px;
  font-weight: 500;
`;

const EmotionDashboardPage = memo(() => {
  // 情绪波动趋势图数据（六类情绪）
  const emotionTypes = ['开心', '平静', '疲惫', '焦虑', '难过', '愤怒'] as const;
  // 主导情绪点（按日期顺序，yField为情绪类型字符串）
  const lineData = weeklyEmotionData.daily.map((item) => ({
    date: item.date,
    emotion: item.dominantEmotion,
  }));
  // 构成分析图数据（Frequency）
  const ringData = weeklyEmotionData.highFrequency.map((item) => ({
    type: item.type,
    value: item.percent,
  }));
  // 主导情绪色彩映射
  const emotionColor = {
    开心: '#FFE8B8',
    平静: '#B8E8C8',
    焦虑: '#B8D8FF',
    难过: '#D8B8FF',
    愤怒: '#FFD8B8',
    疲惫: '#E8E8E8',
  };
  // 筛选器状态
  const [timeRange, setTimeRange] = useState('week');
  // 数据加载状态
  const loading = false;
  // 空数据状态
  const empty = false;

  // 顶部：筛选与概览区
  const today = weeklyEmotionData.daily[weeklyEmotionData.daily.length - 1];
  const highFreq = weeklyEmotionData.highFrequency;
  const fluctuation = weeklyEmotionData.fluctuation;
  const renderTop = () => (
    <Section>
      <Flexbox gap={16}>
        <Flexbox horizontal gap={12}></Flexbox>
        <Flexbox horizontal gap={24}>
          <Card style={{ background: '#F6FFF6', borderRadius: 12 }}>
            <Paragraph>
              今日主导情绪：<span style={{ color: '#2317a6' }}>{today.dominantEmotion}（{today.emotionStrength[today.dominantEmotion]}%）</span>
            </Paragraph>
          </Card>
          <Card style={{ background: '#FFF8E8', borderRadius: 12 }}>
            <Paragraph>
              近七天情绪波动：<span style={{ color: '#22a747' }}>{fluctuation}</span>
            </Paragraph>
          </Card>
          <Card style={{ background: '#FFE8B8', borderRadius: 12 }}>
            <Paragraph>
              近七天高频情绪：
              {highFreq.map((e, i) => (
                <span key={e.type} style={{ color: '#e71f1f', marginRight: 8 }}>{e.type}（{e.percent}%）{i !== highFreq.length - 1 ? '、' : ''}</span>
              ))}
            </Paragraph>
          </Card>
        </Flexbox>
      </Flexbox>
    </Section>
  );

  // 中部：核心可视化区
  // 情绪波动趋势图数据：weeklyEmotionData.daily.map(item => ({ date: item.date, ...item.emotionStrength }))
  // 情绪构成分析图数据：weeklyEmotionData.highFrequency
  const renderMiddle = () => (
    <Section>
      <Flexbox gap={32}>
        <Title level={4} style={{ color: '#333', marginBottom: -15 }}>情绪波动趋势图</Title>
        <div style={{ height: 260, background: 'linear-gradient(90deg,#FFE888,#B8E8C8)', borderRadius: 12 }}>
          <Line
            data={lineData}
            height={240}
            xField="date"
            yField="emotion"
            yAxis={{
              type: 'cat',
              label: {
                formatter: (val: string) => val,
                style: { fontSize: 14 },
              },
              values: emotionTypes,
              title: { text: '情绪', style: { fontSize: 16 } },
            }}
            xAxis={{
              label: {
                rotate: 0,
                style: { fontSize: 14 },
              },
            }}
            color="#B8E8C8"
            point={{ size: 8, shape: 'circle', style: { fill: '#fff', stroke: '#333', lineWidth: 1 } }}
            tooltip={false}
            style={{ borderRadius: 12, background: '#FFF8E8' }}
          />
        </div>
        <Title level={4} style={{ color: '#333', marginBottom: -15 }}>情绪构成分析图</Title>
        <div style={{ height: 200, background: 'linear-gradient(90deg,#FFE888,#B8E8C8)', borderRadius: 12 }}>
          <Pie
            data={ringData}
            height={180}
            width={320}
            color={(type: keyof typeof emotionColor) => emotionColor[type] || '#B8E8C8'}
            angleField="value"
            colorField="type"
            radius={0.8}
            innerRadius={0.6}
            label={false}
            legend={{ position: 'bottom' }}
            style={{ borderRadius: 12, background: '#F6FFF6' }}
          />
        </div>
        <Paragraph style={{ color: '#333', fontSize: 16 }}>{weeklyEmotionData.compositionAdvice1}</Paragraph>
        <Paragraph style={{ color: '#333', fontSize: 16 }}>{weeklyEmotionData.compositionAdvice2}</Paragraph>
      </Flexbox>
    </Section>
  );

  // 下部：情绪解读与建议区
  const renderBottom = () => (
    <Section>
      <Flexbox gap={16}>
        <Paragraph style={{ color: '#333', fontSize: 16 }}>{weeklyEmotionData.actionAdvice1}</Paragraph>
        <Paragraph style={{ color: '#333', fontSize: 16 }}>{weeklyEmotionData.actionAdvice2}</Paragraph>
        <Paragraph style={{ color: '#B8D8FF', fontSize: 16 }}>和上周相比，你的焦虑情绪减少了 10%，继续保持哦 <span style={{ color: '#52C41A' }}>↓</span></Paragraph>
      </Flexbox>
    </Section>
  );
  // 底部：辅助功能区
  const renderFooter = () => (
    <Flexbox horizontal gap={16} style={{ marginTop: 12 }}>
      <Button>导出情绪报告（PDF）</Button>
      <Button>一键隐藏敏感数据</Button>
      <Button danger>清空本周情绪记录</Button>
      <Button>你觉得这份情绪分析准确吗？👍/👎</Button>
    </Flexbox>
  );

  return (
    <GradientBackground>
      <Flexbox gap={24} style={{ maxWidth: 1200, margin: '0 auto' }}>
        {renderTop()}
        {renderMiddle()}
        {renderBottom()}
        {renderFooter()}
      </Flexbox>
    </GradientBackground>
  );
});

EmotionDashboardPage.displayName = 'EmotionDashboardPage';

export default EmotionDashboardPage;
