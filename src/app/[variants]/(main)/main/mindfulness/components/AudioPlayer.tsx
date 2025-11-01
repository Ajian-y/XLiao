'use client';

import { useEffect, useRef, useState } from 'react';
import { PlayCircle, PauseCircle, Volume2, VolumeX } from 'lucide-react';
import styled from '@emotion/styled';
import { ActionIcon } from '@lobehub/ui';
import { message, Slider } from 'antd';

interface AudioPlayerProps {
  onVolumeChange?: (volume: number) => void;
  onMutedChange?: (muted: boolean) => void;
}

const AudioPlayerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  width: fit-content;
`;

const AudioPlayer: React.FC<AudioPlayerProps> = ({ onVolumeChange, onMutedChange }) => {
  const [volume, setVolume] = useState(30); // 初始音量设为30%
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasSource, setHasSource] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!hasSource) {
      message.warning('未找到背景音乐文件：public/audio/meditation-background.mp3');
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }

      // try to play and catch promise rejection
      const playPromise = audioRef.current.play();
      if (playPromise && playPromise instanceof Promise) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('播放失败', err);
            message.error('播放失败，浏览器可能阻止了自动播放或音频格式不受支持');
            setIsPlaying(false);
          });
      } else {
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    if (audioRef.current) {
      audioRef.current.muted = next;
    }
    setIsMuted(next);
    onMutedChange?.(next);
  };

  const handleVolumeChange = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
    setVolume(value);
    onVolumeChange?.(value);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    // check whether the audio file exists to avoid NotSupportedError when clicking play
    const src = '/audio/meditation-background.mp3';
    fetch(src, { method: 'HEAD' })
      .then((res) => {
        setHasSource(res.ok);
      })
      .catch(() => setHasSource(false));
  }, []);

  return (
    <AudioPlayerContainer>
      <audio
        ref={audioRef}
        src="/audio/meditation-background.mp3"
        loop
      />
      <ActionIcon
        icon={isPlaying ? PauseCircle : PlayCircle}
        onClick={togglePlay}
        size="large"
        title={isPlaying ? '暂停' : '播放'}
      />
      <ActionIcon
        icon={isMuted ? VolumeX : Volume2}
        onClick={toggleMute}
        size="large"
        title={isMuted ? '取消静音' : '静音'}
      />
      <Slider
        value={volume}
        onChange={handleVolumeChange}
        min={0}
        max={100}
        tooltip={{ formatter: (value) => `${value}%` }}
        style={{ width: 100 }}
      />
    </AudioPlayerContainer>
  );
};

export default AudioPlayer;