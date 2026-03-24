'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

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

const BreathingAnimation = memo(() => {
  return (
    <Circle
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: 'loop',
        times: [0, 0.5, 1],
      }}
    >
      <InnerCircle
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        呼吸
      </InnerCircle>
    </Circle>
  );
});

BreathingAnimation.displayName = 'BreathingAnimation';

export default BreathingAnimation;