'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Button, Progress, Select } from 'antd';
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
}

const MeditationTimer = ({ duration = 5, onComplete }: MeditationTimerProps) => {
  const [selectedDuration, setSelectedDuration] = useState(duration);
  const [timeLeft, setTimeLeft] = useState(selectedDuration * 60);
  const [isActive, setIsActive] = useState(false);

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration * 60);
  };

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleDurationChange = (value: number) => {
    setSelectedDuration(value);
    setTimeLeft(value * 60);
    setIsActive(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            onComplete?.();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <TimerContainer>
      <Select
        value={selectedDuration}
        onChange={handleDurationChange}
        style={{ width: 120 }}
        options={[
          { value: 5, label: '5 分钟' },
          { value: 10, label: '10 分钟' },
          { value: 15, label: '15 分钟' },
          { value: 20, label: '20 分钟' },
          { value: 30, label: '30 分钟' },
        ]}
      />
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
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button
          type="primary"
          shape="circle"
          icon={isActive ? <Pause size={20} /> : <Play size={20} />}
          onClick={handleStartPause}
        />
        <Button
          shape="circle"
          icon={<RotateCcw size={20} />}
          onClick={handleReset}
        />
      </div>
    </TimerContainer>
  );
};

export default MeditationTimer;