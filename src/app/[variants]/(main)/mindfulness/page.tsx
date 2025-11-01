'use client';

import { Card, Typography, theme } from 'antd';
import { memo, useState, useCallback, useRef } from 'react';
import { Center, Flexbox } from 'react-layout-kit';
import styled from '@emotion/styled';

import AudioPlayer from './components/AudioPlayer';
import BreathingAnimation from './components/BreathingAnimation';
import MeditationTimer from './components/MeditationTimer';
import HealingBackground from './components/HealingBackground';

const { Title, Paragraph } = Typography;

// 使用固定定位覆盖除左侧最小菜单外的所有区域。
// 保留左侧宽度使用 CSS 变量 `--left-menu-width`（默认 72px），便于不同布局复用与调整。
const GradientBackground = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  /* 留出最左侧菜单宽度：可在全局样式或外层布局中设置 --left-menu-width */
  left: var(--left-menu-width, 72px);
  right: 0;
  background: linear-gradient(135deg, #2c1810 0%, #4a3427 50%, #654321 100%);
  padding: 24px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  z-index: 10;
  box-shadow: inset 0 0 100px rgba(255, 200, 150, 0.1);
`;

const StyledCard = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  width: calc(100% - 48px);
  max-width: none;
  margin: 0;
  padding: 32px;
  
  .ant-card-body {
    color: rgba(255, 255, 255, 0.85);
  }

  .ant-typography {
    color: rgba(255, 255, 255, 0.85);
  }
`;

const MindfulnessPage = memo(() => {
  const { token } = theme.useToken();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayerRef = useRef<any>(null);

  // 示例曲目列表（放在 public/audio/ 下或使用外部 URL）
  const tracks = [
    { id: '/audio/meditation-background.mp3', label: '轻柔冥想', src: '/audio/meditation-background.mp3' },
    { id: '/audio/nature-river.mp3', label: '自然流水', src: '/audio/nature-river.mp3' },
  ];

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.reset();
    }
  }, []);

  return (
    <GradientBackground>
      <Flexbox align="center" gap={32} padding={24} style={{ width: '100%', height: '100%' }}>
        <Title level={2} style={{
          color: 'rgba(255, 248, 240, 0.95)',
          textAlign: 'center',
          fontWeight: 500,
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          letterSpacing: '0.05em'
        }}>
          【基础练习】呼吸观察法
        </Title>

        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <HealingBackground />
          <div style={{
            display: 'flex',
            gap: 40,
            alignItems: 'flex-start',
            padding: '24px 32px',
          }}>
            {/* 左侧文本列 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{
                background: 'rgba(255, 248, 240, 0.03)',
                padding: 24,
                borderRadius: 16,
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 248, 240, 0.1)'
              }}>
                <Title level={4} style={{ margin: 0, color: 'rgba(255, 248, 240, 0.95)' }}>准备姿势</Title>
                <Paragraph style={{ marginTop: 12, color: 'rgba(255, 248, 240, 0.8)', lineHeight: '1.8' }}>
                  找一个安静舒适的地方坐下，背部挺直但不要过于僵硬，也可以选择平躺闭眼。双手自然地放在膝盖或腹部，让身体处于放松状态。
                </Paragraph>
              </div>

              <div style={{
                background: 'rgba(255, 248, 240, 0.03)',
                padding: 24,
                borderRadius: 16,
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 248, 240, 0.1)'
              }}>
                <Title level={4} style={{ margin: 0, color: 'rgba(255, 248, 240, 0.95)' }}>觉察分心</Title>
                <Paragraph style={{ marginTop: 12, color: 'rgba(255, 248, 240, 0.8)', lineHeight: '1.8' }}>
                  在练习过程中，思绪很容易飘走，比如想到还没完成的作业，或是和同学之间的小矛盾。当发现自己走神时，不要懊恼，温柔地在心里标记"哦，我走神了"，然后轻轻地将注意力重新聚焦到呼吸上。
                </Paragraph>
              </div>
            </div>

            {/* 中央交互区 */}
            <div style={{ width: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, zIndex: 2 }}>
              <BreathingAnimation isPlaying={isPlaying} />
              <MeditationTimer
                duration={5}
                onStateChange={(isActive) => setIsPlaying(isActive)}
                onReset={handleReset}
              />
              <AudioPlayer
                ref={audioPlayerRef}
                isPlaying={isPlaying}
                tracks={tracks}
                defaultTrackId={tracks[0]?.id}
              />
            </div>

            {/* 右侧文本列 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{
                background: 'rgba(255, 248, 240, 0.03)',
                padding: 24,
                borderRadius: 16,
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 248, 240, 0.1)'
              }}>
                <Title level={4} style={{ margin: 0, color: 'rgba(255, 248, 240, 0.95)' }}>聚焦呼吸</Title>
                <Paragraph style={{ marginTop: 12, color: 'rgba(255, 248, 240, 0.8)', lineHeight: '1.8' }}>
                  将注意力集中在呼吸上，可以感受鼻尖空气的进出，那种微微的凉意；也可以感受腹部的起伏，体会呼吸带来的身体变化。不需要刻意调整呼吸，保持自然就好。
                </Paragraph>
              </div>

              <div style={{
                background: 'rgba(255, 248, 240, 0.03)',
                padding: 24,
                borderRadius: 16,
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 248, 240, 0.1)'
              }}>
                <Title level={4} style={{ margin: 0, color: 'rgba(255, 248, 240, 0.95)' }}>结束练习</Title>
                <Paragraph style={{ marginTop: 12, color: 'rgba(255, 248, 240, 0.8)', lineHeight: '1.8' }}>
                  练习结束时，先静静地感受全身，体会身体的放松和宁静，再慢慢睁开眼睛。不要评判这次练习的效果，只要完成了就是成功。
                </Paragraph>
              </div>
            </div>
          </div>
        </div>
      </Flexbox>
    </GradientBackground>
  );
});

MindfulnessPage.displayName = 'MindfulnessPage';

export default MindfulnessPage;