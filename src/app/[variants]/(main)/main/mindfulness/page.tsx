'use client';

import { Card, Typography, theme } from 'antd';
import { memo, useState } from 'react';
import { Center, Flexbox } from 'react-layout-kit';
import styled from '@emotion/styled';

import AudioPlayer from './components/AudioPlayer';
import BreathingAnimation from './components/BreathingAnimation';
import MeditationTimer from './components/MeditationTimer';

const { Title, Paragraph } = Typography;

const GradientBackground = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d4059 100%);
  min-height: 100vh;
  width: 100%;
  padding: 24px;
`;

const StyledCard = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  
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

  const stepContent = {
    1: '找到一个舒适的姿势，让身体放松...',
    2: '关注你的呼吸，感受它的自然节奏...',
    3: '如果注意力漂移，温和地将它带回呼吸...',
    4: '慢慢睁开眼睛，感受当下的平静...',
  };

  return (
    <GradientBackground>
      <Flexbox align="center" gap={32} padding={24}>
        <Title level={2} style={{ color: 'white', textAlign: 'center' }}>
          【基础练习】呼吸观察法
        </Title>

        <Center gap={24}>
          <BreathingAnimation />
          <MeditationTimer duration={5} />
          <AudioPlayer />
        </Center>

        <StyledCard>
          <Flexbox gap={16}>
            {Object.entries(stepContent).map(([step, content]) => (
              <Flexbox gap={8} key={step}>
                <Title level={4} style={{ margin: 0 }}>
                  {step}. {step === '1' ? '准备姿势' :
                    step === '2' ? '聚焦呼吸' :
                      step === '3' ? '觉察分心' : '结束练习'}
                </Title>
                <Paragraph>{content}</Paragraph>
              </Flexbox>
            ))}
          </Flexbox>
        </StyledCard>
      </Flexbox>
    </GradientBackground>
  );
});

MindfulnessPage.displayName = 'MindfulnessPage';

export default MindfulnessPage;