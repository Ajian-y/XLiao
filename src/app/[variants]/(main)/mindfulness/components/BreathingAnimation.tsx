'use client';

import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const Circle = styled(motion.div)`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const InnerCircle = styled(motion.div)`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  color: white;
`;

const GuidanceText = styled(motion.div)`
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.5em;
  height: 36px;
  text-align: center;
  position: absolute;
  top: -48px;
  left: 0;
  right: 0;
`;

const Description = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9em;
  text-align: center;
  margin-top: 8px;
`;

interface BreathingAnimationProps {
  isPlaying?: boolean;
  onReset?: () => void;
}

const BreathingAnimation = memo<BreathingAnimationProps>(({ isPlaying = false, onReset }) => {
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(0);

  // 使用 Framer Motion 的动画计时代替 setInterval
  useEffect(() => {
    let frameId: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const totalDuration = 12000; // 12秒一个完整周期

      if (isPlaying) {
        setCount(Math.floor((elapsed % totalDuration) / 1000));
        frameId = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      frameId = requestAnimationFrame(animate);
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isPlaying]);

  // 重置状态
  useEffect(() => {
    if (!isPlaying) {
      setCount(0);
      setBreathPhase('inhale');
    }
  }, [isPlaying]);

  // 根据计数更新呼吸阶段
  useEffect(() => {
    if (!isPlaying) return;

    if (count < 4) {
      setBreathPhase('inhale');
    } else if (count < 6) {
      setBreathPhase('hold');
    } else if (count < 10) {
      setBreathPhase('exhale');
    } else {
      setBreathPhase('hold');
    }
  }, [count, isPlaying]);

  const guidance = {
    inhale: '吸气',
    hold: '屏息',
    exhale: '呼气',
  };

  return (
    <Container>
      <GuidanceText
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        {guidance[breathPhase]}
      </GuidanceText>

      <Circle
        animate={{
          scale: isPlaying
            ? (breathPhase === 'inhale'
              ? 1.2
              : breathPhase === 'exhale'
                ? 1
                : (breathPhase === 'hold' && count < 6 ? 1.2 : 1))
            : 1
        }}
        initial={{ scale: 1 }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          type: "tween"
        }}
      >
        <InnerCircle
          animate={{
            opacity: isPlaying ? 0.8 : 0.5,
            scale: isPlaying
              ? (breathPhase === 'inhale'
                ? 1.1
                : breathPhase === 'exhale'
                  ? 0.9
                  : 1)
              : 1
          }}
          initial={{ opacity: 0.5, scale: 1 }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            type: "tween"
          }}
        >
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {breathPhase === 'hold' ? '停' : '息'}
          </motion.div>
        </InnerCircle>
      </Circle>

      <Description>
        跟随圆圈呼吸：4秒吸气，2秒屏息，4秒呼气，2秒屏息
      </Description>
    </Container>
  );
});

BreathingAnimation.displayName = 'BreathingAnimation';

export default BreathingAnimation;