'use client';

import { useEffect, useRef, useState, memo, forwardRef, useImperativeHandle } from 'react';
import { PlayCircle, PauseCircle, Volume2, VolumeX } from 'lucide-react';
import styled from '@emotion/styled';
import { ActionIcon } from '@lobehub/ui';
import { message, Slider, Select } from 'antd';

interface TrackItem {
  id: string;
  label: string;
  src: string;
}

interface AudioPlayerProps {
  tracks?: TrackItem[];
  defaultTrackId?: string;
  onVolumeChange?: (volume: number) => void;
  onMutedChange?: (muted: boolean) => void;
  isPlaying?: boolean;
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

const AudioPlayer = memo(forwardRef<{ reset: () => void }, AudioPlayerProps>((props, ref) => {
  const { tracks = [], defaultTrackId, onVolumeChange, onMutedChange, isPlaying = false } = props;
  const [volume, setVolume] = useState(30); // 初始音量设为30%
  const [isMuted, setIsMuted] = useState(false);
  const [hasSource, setHasSource] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | undefined>(
    defaultTrackId ?? tracks[0]?.id ?? '/audio/meditation-background.mp3',
  );

  useEffect(() => {
    if (!hasSource) return;

    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise && playPromise instanceof Promise) {
          playPromise.catch((err) => {
            console.warn('播放失败', err);
            message.error('播放失败，浏览器可能阻止了自动播放或音频格式不受支持');
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, hasSource]);

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

  // 检测并加载选中曲目资源：使用 audio 元素事件替代 fetch HEAD，可靠性更高
  useEffect(() => {
    const src = tracks.find((t) => t.id === selectedTrackId)?.src ?? selectedTrackId ?? '/audio/meditation-background.mp3';

    const el = audioRef.current;
    if (!el) return;

    // 标记为不可用，等待 canplay 事件
    setHasSource(false);

    // 先解除之前的监听（防止重复）
    el.removeAttribute('src');
    el.load();

    const onCanPlay = () => {
      setHasSource(true);
      // 如果外部处于播放状态，尝试自动播放
      if (isPlaying) {
        const p = el.play();
        if (p && p instanceof Promise) p.catch(() => { });
      }
    };

    const onError = () => {
      setHasSource(false);
    };

    el.addEventListener('canplay', onCanPlay);
    el.addEventListener('error', onError);

    // 更新 src 并 load
    el.src = src;
    el.load();

    return () => {
      el.removeEventListener('canplay', onCanPlay);
      el.removeEventListener('error', onError);
    };
  }, [selectedTrackId, tracks, isPlaying]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        // 确保取消静音在音频元素上也生效
        audioRef.current.muted = false;
      }
      setVolume(30);
      setIsMuted(false);
    },
  }), []);

  // 确保 isMuted 状态变化时同步到 audio 元素
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  return (
    <AudioPlayerContainer>
      <audio
        ref={audioRef}
        loop
      />

      {/* 曲目选择 */}
      <Select
        value={selectedTrackId}
        onChange={(val) => setSelectedTrackId(val)}
        style={{ width: 220 }}
        disabled={isPlaying}
        title={isPlaying ? '播放中无法切换曲目，按重置或等待结束后可切换' : undefined}
        options={
          tracks.length > 0
            ? tracks.map((t) => ({ label: t.label, value: t.id }))
            : [{ label: '默认冥想音乐', value: '/audio/meditation-background.mp3' }]
        }
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
}));

export default AudioPlayer;