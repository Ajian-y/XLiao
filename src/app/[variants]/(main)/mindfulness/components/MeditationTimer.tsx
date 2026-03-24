'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Button, Progress } from 'antd';
import { Play, Pause, RotateCcw } from 'lucide-react';

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const TimeText = styled.div`
  font-size: 1.5em;
  color: rgba(255, 255, 255, 0.85);
`;

interface MeditationTimerProps {
  duration?: number; // in minutes
  onComplete?: () => void;
  onStateChange?: (isActive: boolean) => void;
  onReset?: () => void;
}

const MeditationTimer = ({ duration = 5, onComplete, onStateChange, onReset }: MeditationTimerProps) => {
  const fixedDuration = 5; // 固定 5 分钟
  const [timeLeft, setTimeLeft] = useState(fixedDuration * 60);
  const [isActive, setIsActive] = useState(false);

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(fixedDuration * 60);
    onReset?.();
  };

  const handleStartPause = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    onStateChange?.(nextState);
  };

  // 时长固定为 5 分钟，移除选择逻辑

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            // 到期：停止本地计时器，调用完成回调，并触发外部重置（例如音频与动画）
            setIsActive(false);
            onComplete?.();
            onReset?.();
            // 将本地计时器重置为初始值（异步以避免在当前 setState 内冲突）
            setTimeout(() => setTimeLeft(fixedDuration * 60), 0);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete, onReset]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((fixedDuration * 60 - timeLeft) / (fixedDuration * 60)) * 100;

  return (
    <TimerContainer>
      {/* 固定时长：5 分钟 */}
      <Progress
        percent={progress}
        showInfo={false}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
        trailColor="rgba(255,255,255,0.1)"
        type="circle"
        size={200}
      />
      <TimeText>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </TimeText>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={isActive ? <Pause size={24} /> : <Play size={24} />}
          onClick={handleStartPause}
          style={{
            background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(24, 144, 255, 0.8)',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: 56,
            height: 56,
          }}
        />
        <Button
          shape="circle"
          size="large"
          icon={<RotateCcw size={24} />}
          onClick={handleReset}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            width: 56,
            height: 56,
          }}
        />
      </div>
    </TimerContainer>
  );
};

export default MeditationTimer;