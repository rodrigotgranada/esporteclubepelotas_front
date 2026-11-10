'use client';

import { useState, useEffect } from 'react';

export interface ScoreData {
  pelotasScore: number;
  opponentScore: number;
  penaltyPelotasScore: number | null;
  penaltyOpponentScore: number | null;
}

export interface UseAdminMatchScoreModalProps {
  isOpen: boolean;
  initialPelotasScore?: number | null;
  initialOpponentScore?: number | null;
  initialPenaltyPelotasScore?: number | null;
  initialPenaltyOpponentScore?: number | null;
  onConfirm: (scores: ScoreData) => void;
  onClose: () => void;
}

export const useAdminMatchScoreModal = ({
  isOpen,
  initialPelotasScore,
  initialOpponentScore,
  initialPenaltyPelotasScore,
  initialPenaltyOpponentScore,
  onConfirm,
  onClose,
}: UseAdminMatchScoreModalProps) => {
  const [pelotasScore, setPelotasScore] = useState<string>('0');
  const [opponentScore, setOpponentScore] = useState<string>('0');
  const [hasPenalties, setHasPenalties] = useState<boolean>(false);
  const [penaltyPelotas, setPenaltyPelotas] = useState<string>('0');
  const [penaltyOpponent, setPenaltyOpponent] = useState<string>('0');
  const [error, setError] = useState<string | null>(null);

  // Sincronizar estado inicial ao abrir modal
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setPelotasScore(
        initialPelotasScore !== null && initialPelotasScore !== undefined
          ? String(initialPelotasScore)
          : '0'
      );
      setOpponentScore(
        initialOpponentScore !== null && initialOpponentScore !== undefined
          ? String(initialOpponentScore)
          : '0'
      );

      const hadPenalties =
        (initialPenaltyPelotasScore !== null && initialPenaltyPelotasScore !== undefined) ||
        (initialPenaltyOpponentScore !== null && initialPenaltyOpponentScore !== undefined);

      setHasPenalties(hadPenalties);
      setPenaltyPelotas(
        initialPenaltyPelotasScore !== null && initialPenaltyPelotasScore !== undefined
          ? String(initialPenaltyPelotasScore)
          : '0'
      );
      setPenaltyOpponent(
        initialPenaltyOpponentScore !== null && initialPenaltyOpponentScore !== undefined
          ? String(initialPenaltyOpponentScore)
          : '0'
      );
    }
  }, [
    isOpen,
    initialPelotasScore,
    initialOpponentScore,
    initialPenaltyPelotasScore,
    initialPenaltyOpponentScore,
  ]);

  const handleTogglePenalties = () => {
    setHasPenalties((prev) => {
      const next = !prev;
      if (!next) {
        setPenaltyPelotas('0');
        setPenaltyOpponent('0');
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const pScore = Number(pelotasScore);
    const oScore = Number(opponentScore);

    if (Number.isNaN(pScore) || pScore < 0 || Number.isNaN(oScore) || oScore < 0) {
      setError('Os gols informados devem ser números válidos maiores ou iguais a 0.');
      return;
    }

    let pPenalties: number | null = null;
    let oPenalties: number | null = null;

    if (hasPenalties) {
      const pPen = Number(penaltyPelotas);
      const oPen = Number(penaltyOpponent);

      if (Number.isNaN(pPen) || pPen < 0 || Number.isNaN(oPen) || oPen < 0) {
        setError('Os gols nos pênaltis devem ser números válidos maiores ou iguais a 0.');
        return;
      }
      pPenalties = pPen;
      oPenalties = oPen;
    }

    setError(null);
    onConfirm({
      pelotasScore: pScore,
      opponentScore: oScore,
      penaltyPelotasScore: pPenalties,
      penaltyOpponentScore: oPenalties,
    });
    onClose();
  };

  return {
    pelotasScore,
    setPelotasScore,
    opponentScore,
    setOpponentScore,
    hasPenalties,
    handleTogglePenalties,
    penaltyPelotas,
    setPenaltyPelotas,
    penaltyOpponent,
    setPenaltyOpponent,
    error,
    handleConfirm,
  };
};
