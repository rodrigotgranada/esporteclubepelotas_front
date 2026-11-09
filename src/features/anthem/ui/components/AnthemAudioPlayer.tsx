import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Music2,
  Loader2,
} from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Badge,
} from '@/shared/ui/components';
import { ClubAnthem } from '../../types/anthem.types';
import { ANTHEM_TEXTS } from '../../constants/anthem.constants';
import { useAnthemAudioPlayer } from '../../hooks/useAnthemAudioPlayer';

export interface AnthemAudioPlayerProps {
  anthem: ClubAnthem | null;
}

export const AnthemAudioPlayer: React.FC<AnthemAudioPlayerProps> = ({ anthem }) => {
  const audioUrl = anthem?.audioUrl;

  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoadingAudio,
    hasError,
    progressPercent,
    formatTime,
    togglePlayPause,
    seek,
    changeVolume,
    toggleMute,
    restart,
  } = useAnthemAudioPlayer(audioUrl);

  // Se não houver áudio ou houver falha, não renderiza absolutamente nada
  if (!audioUrl || hasError) {
    return null;
  }

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const targetTime = (value / 100) * duration;
    seek(targetTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeVolume(parseFloat(e.target.value));
  };

  return (
    <LayoutContainer className="relative overflow-hidden rounded-3xl border border-primary/40 bg-surface/90 backdrop-blur-md p-6 sm:p-8 shadow-xl shadow-primary/5">
      {/* Detalhe Superior com Status de Reprodução */}
      <LayoutContainer className="flex items-center justify-between gap-4 mb-6">
        <LayoutContainer className="flex items-center gap-3">
          <LayoutContainer className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <Music2 className="w-5 h-5" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col">
            <Title level="h3" className="text-base sm:text-lg font-black text-text-primary">
              {anthem?.title || ANTHEM_TEXTS.DEFAULT_TITLE}
            </Title>
            <Text className="text-xs text-text-secondary">
              {anthem?.authorMusic || anthem?.authorLyrics || ANTHEM_TEXTS.HISTORY_DEFAULT_AUTHOR}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        <Badge
          variant={isPlaying ? 'primary' : 'default'}
          size="sm"
          className="font-extrabold uppercase text-[10px] tracking-wider px-2.5 py-1"
        >
          {isPlaying ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-950 animate-ping" />
              {ANTHEM_TEXTS.PLAYER_STATUS_PLAYING}
            </span>
          ) : (
            <span>{ANTHEM_TEXTS.PLAYER_STATUS_PAUSED}</span>
          )}
        </Badge>
      </LayoutContainer>

      <LayoutContainer className="flex flex-col gap-6">
        {/* Barra de Progresso com Controles de Tempo */}
        <LayoutContainer className="flex flex-col gap-2">
          <LayoutContainer className="relative w-full flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progressPercent}
              onChange={handleSeekChange}
              aria-label={ANTHEM_TEXTS.PLAYER_SEEK}
              className="w-full h-2 rounded-lg bg-surface border border-border/80 appearance-none cursor-pointer accent-primary focus:outline-none"
            />
          </LayoutContainer>

          <LayoutContainer className="flex items-center justify-between text-xs font-mono font-bold text-text-secondary px-0.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </LayoutContainer>
        </LayoutContainer>

        {/* Botões Principais de Controle */}
        <LayoutContainer className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Lado Esquerdo: Play/Pause e Reiniciar */}
          <LayoutContainer className="flex items-center gap-3">
            <Button
              variant="custom"
              size="none"
              onClick={togglePlayPause}
              disabled={isLoadingAudio}
              className="w-14 h-14 rounded-full bg-primary hover:brightness-110 flex items-center justify-center font-black shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-[#0b1a32] shrink-0 cursor-pointer"
              title={isPlaying ? ANTHEM_TEXTS.PLAYER_PAUSE : ANTHEM_TEXTS.PLAYER_PLAY}
              aria-label={isPlaying ? ANTHEM_TEXTS.PLAYER_PAUSE : ANTHEM_TEXTS.PLAYER_PLAY}
            >
              {isLoadingAudio ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#0b1a32]" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6 text-[#0b1a32] fill-[#0b1a32]" />
              ) : (
                <Play className="w-6 h-6 text-[#0b1a32] fill-[#0b1a32] ml-0.5" />
              )}
            </Button>

            <Button
              variant="outline"
              size="none"
              onClick={restart}
              className="w-10 h-10 rounded-full bg-surface border border-border/70 flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
              title={ANTHEM_TEXTS.PLAYER_RESTART}
              aria-label={ANTHEM_TEXTS.PLAYER_RESTART}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </LayoutContainer>

          {/* Lado Direito: Controle de Volume e Download */}
          <LayoutContainer className="flex items-center gap-4">
            <LayoutContainer className="flex items-center gap-2">
              <Button
                variant="outline"
                size="none"
                onClick={toggleMute}
                className="w-9 h-9 rounded-full bg-surface border border-border/70 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                title={isMuted ? ANTHEM_TEXTS.PLAYER_UNMUTE : ANTHEM_TEXTS.PLAYER_MUTE}
                aria-label={isMuted ? ANTHEM_TEXTS.PLAYER_UNMUTE : ANTHEM_TEXTS.PLAYER_MUTE}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-primary" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label={ANTHEM_TEXTS.PLAYER_VOLUME}
                className="w-20 sm:w-28 h-1.5 rounded-lg bg-surface border border-border/60 appearance-none cursor-pointer accent-primary focus:outline-none"
              />
            </LayoutContainer>

            {audioUrl && (
              <a
                href={audioUrl}
                download="hino-esporte-clube-pelotas.mp3"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-surface border border-border/70 flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/50 transition-colors inline-flex"
                title={ANTHEM_TEXTS.PLAYER_DOWNLOADING}
                aria-label={ANTHEM_TEXTS.PLAYER_DOWNLOADING}
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
