import React from 'react';
import { Shield, Sparkles, Dog, Flag, Palette } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  SafeImage,
  Button,
} from '@/shared/ui/components';
import { SYMBOLS_TEXTS } from '../../constants/symbols.constants';
import { SymbolsTabType } from '../../hooks/useSymbols';

export interface SymbolsHeroProps {
  activeTab: SymbolsTabType;
  onTabChange: (tab: SymbolsTabType) => void;
}

export const SymbolsHero: React.FC<SymbolsHeroProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <LayoutContainer className="relative w-full overflow-hidden bg-gradient-to-b from-primary/15 via-surface/60 to-background border-b border-border/70 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      {/* Glow Dourado de Fundo */}
      <LayoutContainer
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
      />

      <LayoutContainer className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Distintivo Oficial com Animação Suave */}
        <LayoutContainer className="relative w-24 h-24 sm:w-28 sm:h-28 mb-6 drop-shadow-2xl hover:scale-105 transition-transform duration-300">
          <SafeImage
            src="/images/pelotas-logo.png"
            alt="Esporte Clube Pelotas"
            fill
            sizes="112px"
            className="object-contain"
            fallbackSrc="/images/pelotas-logo.png"
          />
        </LayoutContainer>

        {/* Badge */}
        <Badge
          variant="primary"
          size="sm"
          className="font-extrabold uppercase tracking-widest px-3 py-1 text-[11px] inline-flex items-center gap-1.5 shadow-xs mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <Text as="span">{SYMBOLS_TEXTS.HERO_BADGE}</Text>
        </Badge>

        {/* Título Monumental */}
        <Title
          level="h1"
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-tight mb-3 sm:mb-4"
        >
          {SYMBOLS_TEXTS.HERO_TITLE}
        </Title>

        {/* Subtítulo */}
        <Text
          as="p"
          className="text-base sm:text-xl font-medium text-text-secondary mb-8 max-w-2xl leading-relaxed"
        >
          {SYMBOLS_TEXTS.HERO_SUBTITLE}
        </Text>

        {/* Seletor de Abas Mobile First */}
        <LayoutContainer className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-surface/90 border border-border/80 shadow-md backdrop-blur-md">
          <Button
            variant={activeTab === 'MASCOT' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('MASCOT')}
            leftIcon={<Dog className="w-4 h-4" />}
            className="font-bold text-xs sm:text-sm px-4 py-2"
          >
            {SYMBOLS_TEXTS.TAB_MASCOT}
          </Button>

          <Button
            variant={activeTab === 'SHIELD' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('SHIELD')}
            leftIcon={<Shield className="w-4 h-4" />}
            className="font-bold text-xs sm:text-sm px-4 py-2"
          >
            {SYMBOLS_TEXTS.TAB_SHIELD}
          </Button>

          <Button
            variant={activeTab === 'FLAG_COLORS' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('FLAG_COLORS')}
            leftIcon={<Palette className="w-4 h-4" />}
            className="font-bold text-xs sm:text-sm px-4 py-2"
          >
            {SYMBOLS_TEXTS.TAB_FLAG_COLORS}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
