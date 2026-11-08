'use client';

import { useState, useEffect } from 'react';

// Cache em memória para evitar reprocessamento de imagens já analisadas
const luminanceCache = new Map<string, boolean>();

/**
 * Hook que analisa assincronamente a luminância e saturação de um asset de imagem.
 * Detecta se o logo possui arte predominantemente branca ou muito clara sobre fundo transparente.
 * Retorna `isLightAsset: true` caso o logo seja branco/prata monocromático.
 */
export const useImageLuminance = (src?: string | null) => {
  const [isLightAsset, setIsLightAsset] = useState<boolean>(() => {
    if (!src) return false;
    return luminanceCache.get(src) ?? false;
  });

  useEffect(() => {
    if (!src) {
      setIsLightAsset(false);
      return;
    }

    if (luminanceCache.has(src)) {
      setIsLightAsset(luminanceCache.get(src)!);
      return;
    }

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // Amostragem ultra leve em 24x24 px (performance máxima de ~0.2ms)
        canvas.width = 24;
        canvas.height = 24;
        ctx.drawImage(img, 0, 0, 24, 24);

        const imgData = ctx.getImageData(0, 0, 24, 24).data;
        let totalLuminance = 0;
        let totalSaturation = 0;
        let opaquePixels = 0;

        for (let i = 0; i < imgData.length; i += 4) {
          const a = imgData[i + 3];
          // Considera apenas pixels visíveis não transparentes
          if (a > 40) {
            const r = imgData[i];
            const g = imgData[i + 1];
            const b = imgData[i + 2];

            // Luminância perceptiva BT.601
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const sat = max === 0 ? 0 : (max - min) / max;

            totalLuminance += lum;
            totalSaturation += sat;
            opaquePixels++;
          }
        }

        if (opaquePixels > 0) {
          const avgLum = totalLuminance / opaquePixels;
          const avgSat = totalSaturation / opaquePixels;

          // Se os pixels visíveis tiverem alta luminância (>= 175) e baixa saturação (< 0.35),
          // é uma marca predominantemente branca / cinza claro
          const isWhite = avgLum >= 175 && avgSat < 0.35;

          luminanceCache.set(src, isWhite);
          if (isMounted) {
            setIsLightAsset(isWhite);
          }
        }
      } catch (err) {
        // Fallback resiliente caso CORS bloqueie leitura de canvas
        console.debug('Luminance check skipped due to CORS policy', err);
      }
    };

    img.onerror = () => {
      // Ignora erro em imagens que falhem no download
    };

    img.src = src;

    return () => {
      isMounted = false;
    };
  }, [src]);

  return { isLightAsset };
};
