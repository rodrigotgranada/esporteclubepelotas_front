'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

export interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
}

export const DEFAULT_NEWS_COVER = '/images/default-news-cover.svg';
export const DEFAULT_IDOL_COVER = '/images/default-idol-cover.svg';

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = DEFAULT_NEWS_COVER,
  alt = '',
  className = '',
  unoptimized,
  ...props
}) => {
  const initialSrc = src && src.trim() !== '' ? src : fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [hasFailed, setHasFailed] = useState<boolean>(!src || src.trim() === '');

  useEffect(() => {
    if (src && src.trim() !== '') {
      setCurrentSrc(src);
      setHasFailed(false);
    } else {
      setCurrentSrc(fallbackSrc);
      setHasFailed(true);
    }
  }, [src, fallbackSrc]);

  const isSvg = typeof currentSrc === 'string' && currentSrc.endsWith('.svg');

  return (
    <Image
      {...props}
      key={currentSrc}
      src={currentSrc}
      alt={alt}
      className={className}
      unoptimized={unoptimized ?? (isSvg || hasFailed)}
      onError={() => {
        if (!hasFailed && currentSrc !== fallbackSrc) {
          setHasFailed(true);
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
};

