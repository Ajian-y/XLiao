'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const Bg = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
`;

const Floating = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  filter: blur(24px);
  opacity: 0.7;
`;

const HealingBackground = memo(() => {
  return (
    <Bg>
      <Floating
        style={{ width: 420, height: 420, left: '10%', top: '5%', background: 'rgba(255,200,200,0.08)' }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <Floating
        style={{ width: 360, height: 360, right: '8%', top: '18%', background: 'rgba(160,200,255,0.07)' }}
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <Floating
        style={{ width: 260, height: 260, left: '30%', bottom: '10%', background: 'rgba(200,240,200,0.06)' }}
        animate={{ x: [0, 12, 0] }}
        transition={{ duration: 9, repeat: Infinity }}
      />
    </Bg>
  );
});

HealingBackground.displayName = 'HealingBackground';

export default HealingBackground;
