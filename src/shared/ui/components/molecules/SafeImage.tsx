'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

export interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
}

export const DEFAULT_NEWS_COVER = '/images/default-news-cover.svg';
export const DEFAULT_IDOL_COVER = '/images/default-idol-cover.svg';

const SYNTHETIC_UNSPLASH_REGEX = /^https?:\/\/images\.unsplash\.com\/photo-\d+(\?|$)/i;
const KNOWN_DEAD_IMAGE_TOKENS = ['photo-1508098682722', 'photo-1517649763962'];

export function isUnoptimizedImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    /\.svg(\?|$)/i.test(trimmed)
  );
}

function isUsableImageSrc(url?: string | null): url is string {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (SYNTHETIC_UNSPLASH_REGEX.test(trimmed)) return false;
  if (KNOWN_DEAD_IMAGE_TOKENS.some((token) => trimmed.includes(token))) return false;
  return true;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = DEFAULT_NEWS_COVER,
  alt = '',
  className = '',
  unoptimized,
  loading = "eager",
  ...props
}) => {
  const usable = isUsableImageSrc(src);
  const initialSrc = usable ? src.trim() : fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [hasFailed, setHasFailed] = useState<boolean>(!usable);

  useEffect(() => {
    if (isUsableImageSrc(src)) {
      setCurrentSrc(src.trim());
      setHasFailed(false);
    } else {
      setCurrentSrc(fallbackSrc);
      setHasFailed(true);
    }
  }, [src, fallbackSrc]);

  return (
    <Image
      {...props}
      key={currentSrc}
      src={currentSrc}
      alt={alt}
      sizes={props.sizes || (props.fill ? '100vw' : undefined)}
      loading={props.priority ? undefined : loading}
      className={className}
      unoptimized={unoptimized ?? (isUnoptimizedImageUrl(currentSrc) || hasFailed)}
      onError={() => {
        if (!hasFailed && currentSrc !== fallbackSrc) {
          setHasFailed(true);
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
};
