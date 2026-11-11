'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Spinner,
} from '@/shared/ui/components';
import { Vote, CheckCircle2, Crown, LogIn, Lock } from 'lucide-react';
import { POLL_TEXTS } from '../../constants/poll.constants';
import { useClubPoll } from '../../hooks/useClubPoll';

export function ClubPollWidget() {
  const {
    poll,
    isLoading,
    isVoting,
    isAuthenticated,
    isMember,
    selectedOptionId,
    setSelectedOptionId,
    handleVote,
  } = useClubPoll();

  if (isLoading) {
    return (
      <LayoutContainer className="rounded-2xl border border-gray-800 bg-[#071126]/40 p-6 flex items-center justify-center min-h-[220px]">
        <Spinner size={24} className="text-amber-400" />
      </LayoutContainer>
    );
  }

  if (!poll) {
    return null;
  }

  const showResults = poll.userHasVoted || !poll.active;

  return (
    <LayoutContainer className="relative overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-b from-[#0B1B3D] to-[#071126] p-6 md:p-8 shadow-xl my-8">
      {/* Cabeçalho da Enquete */}
      <LayoutContainer className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <LayoutContainer className="flex items-center gap-2">
          <Badge className="bg-amber-400/10 text-amber-400 border border-amber-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Vote size={14} />
            {POLL_TEXTS.BADGE}
          </Badge>

          {poll.onlyMembers && (
            <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-xs font-semibold flex items-center gap-1">
              <Crown size={12} />
              {POLL_TEXTS.MEMBERS_ONLY_BADGE}
            </Badge>
          )}
        </LayoutContainer>

        <Text className="text-xs text-gray-400 font-medium">
          {poll.totalVotes} {POLL_TEXTS.TOTAL_VOTES}
        </Text>
      </LayoutContainer>

      {/* Pergunta */}
      <Title level="h3" className="text-xl md:text-2xl font-bold text-white mb-2 leading-snug">
        {poll.title}
      </Title>

      {poll.description && (
        <Text className="text-sm text-gray-300 mb-6 leading-relaxed">
          {poll.description}
        </Text>
      )}

      {/* Opções de Voto */}
      <LayoutContainer className="flex flex-col gap-3 my-6">
        {poll.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isVoted = poll.userVotedOptionId === option.id;

          if (showResults) {
            // Visualização de Resultado Parcial / Final
            return (
              <LayoutContainer
                key={option.id}
                className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
                  isVoted
                    ? 'border-amber-400 bg-amber-400/10 shadow-md'
                    : 'border-gray-800 bg-[#040A18]/60'
                }`}
              >
                {/* Barra de Progresso de Fundo */}
                <LayoutContainer
                  className="absolute inset-y-0 left-0 bg-amber-400/15 transition-all duration-700"
                  style={{ width: `${option.percentage}%` }}
                />

                <LayoutContainer className="relative z-10 flex items-center justify-between gap-4">
                  <LayoutContainer className="flex items-center gap-2">
                    {isVoted && <CheckCircle2 size={16} className="text-amber-400 flex-shrink-0" />}
                    <Text className={`text-sm font-semibold ${isVoted ? 'text-amber-400' : 'text-white'}`}>
                      {option.title}
                    </Text>
                  </LayoutContainer>

                  <LayoutContainer className="flex items-center gap-2">
                    <Text className="text-xs text-gray-400">
                      {option.votesCount} {option.votesCount === 1 ? 'voto' : 'votos'}
                    </Text>
                    <Text className="text-sm font-black text-amber-400 min-w-[45px] text-right">
                      {option.percentage}%
                    </Text>
                  </LayoutContainer>
                </LayoutContainer>
              </LayoutContainer>
            );
          }

          // Visualização de Seleção de Opção
          return (
            <LayoutContainer
              key={option.id}
              onClick={() => {
                if (isMember) {
                  setSelectedOptionId(option.id);
                }
              }}
              className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                isMember ? 'cursor-pointer hover:border-amber-400/60' : 'opacity-80'
              } ${
                isSelected
                  ? 'border-amber-400 bg-amber-400/10 shadow-md'
                  : 'border-gray-800 bg-[#040A18]/60'
              }`}
            >
              <LayoutContainer className="flex items-center gap-3">
                <LayoutContainer
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400'
                      : 'border-gray-600'
                  }`}
                >
                  {isSelected && <LayoutContainer className="h-2 w-2 rounded-full bg-[#0B1B3D]" />}
                </LayoutContainer>

                <Text className={`text-sm font-medium ${isSelected ? 'text-amber-400 font-bold' : 'text-gray-200'}`}>
                  {option.title}
                </Text>
              </LayoutContainer>

              {!isMember && (
                <Lock size={14} className="text-gray-500" />
              )}
            </LayoutContainer>
          );
        })}
      </LayoutContainer>

      {/* Rodapé / CTAs de Ação */}
      <LayoutContainer className="pt-2 border-t border-gray-800/80">
        {!isAuthenticated ? (
          // Não Logado
          <LayoutContainer className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-gray-800 bg-[#040A18]/40">
            <Text className="text-xs text-gray-400 text-center sm:text-left">
              Entre com sua conta de sócio para votar nesta enquete oficial.
            </Text>
            <Link href="/auth/login">
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1.5 border-amber-400/40 text-amber-400 hover:bg-amber-400/10 font-bold"
              >
                <LogIn size={14} />
                <Text as="span">{POLL_TEXTS.CTA_LOGIN_TO_VOTE}</Text>
              </Button>
            </Link>
          </LayoutContainer>
        ) : !isMember && poll.onlyMembers ? (
          // Logado como torcedor comum (não sócio) -> Banner Dourado Chamativo
          <LayoutContainer className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-yellow-500/15 p-5 shadow-inner">
            <LayoutContainer className="flex items-start gap-3">
              <Crown size={24} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <LayoutContainer>
                <Title level="h4" className="text-sm font-bold text-yellow-300">
                  {POLL_TEXTS.CTA_NON_MEMBER_TITLE}
                </Title>
                <Text className="text-xs text-gray-300 mt-1">
                  {POLL_TEXTS.CTA_NON_MEMBER_DESC}
                </Text>
              </LayoutContainer>
            </LayoutContainer>

            <Link href="/socio">
              <Button
                size="sm"
                className="bg-yellow-400 font-bold text-[#0B1B3D] hover:bg-yellow-300 flex-shrink-0"
              >
                <Crown size={14} className="mr-1 inline" />
                <Text as="span">{POLL_TEXTS.CTA_BECOME_MEMBER_BUTTON}</Text>
              </Button>
            </Link>
          </LayoutContainer>
        ) : showResults ? (
          // Já votou
          <LayoutContainer className="flex items-center justify-between text-xs text-gray-400">
            <LayoutContainer className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 size={16} />
              <Text as="span">{POLL_TEXTS.VOTE_RECORDED}</Text>
            </LayoutContainer>
            <Text as="span">Obrigado por fortalecer o clube!</Text>
          </LayoutContainer>
        ) : (
          // Sócio habilitado para votar
          <LayoutContainer className="flex items-center justify-end">
            <Button
              onClick={handleVote}
              disabled={isVoting || !selectedOptionId}
              className="bg-amber-400 font-bold text-[#0B1B3D] hover:bg-amber-300 px-6 py-2"
            >
              {isVoting ? (
                <>
                  <Spinner size={16} className="mr-2" />
                  <Text as="span">{POLL_TEXTS.VOTING_BUTTON}</Text>
                </>
              ) : (
                <Text as="span">{POLL_TEXTS.CONFIRM_VOTE_BUTTON}</Text>
              )}
            </Button>
          </LayoutContainer>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
}

