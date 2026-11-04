'use client';

import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { FaWhatsapp, FaXTwitter, FaFacebookF } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { LayoutContainer, Text, Button } from '@/shared/ui/components';
import { PUBLIC_NEWS_TEXTS } from '../../constants/news.constants';

export interface NewsSocialShareBarProps {
  title: string;
  slug: string;
}

export const NewsSocialShareBar: React.FC<NewsSocialShareBarProps> = ({ title, slug }) => {
  const [copied, setCopied] = useState(false);

  const getArticleUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return `https://ecpelotas.com.br/noticias/${slug}`;
  };

  const handleCopyLink = () => {
    const url = getArticleUrl();
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(PUBLIC_NEWS_TEXTS.SHARE_COPIED);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const url = getArticleUrl();
    const message = PUBLIC_NEWS_TEXTS.SHARE_WHATSAPP_TEXT(title, url);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareTwitter = () => {
    const url = getArticleUrl();
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleShareFacebook = () => {
    const url = getArticleUrl();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <LayoutContainer className="flex flex-wrap items-center gap-2">
      <LayoutContainer className="hidden sm:flex items-center gap-1.5 text-xs text-text-secondary font-medium mr-1">
        <Share2 className="w-3.5 h-3.5 text-primary" />
        <Text as="span">{PUBLIC_NEWS_TEXTS.SHARE_TITLE}</Text>
      </LayoutContainer>

      {/* WhatsApp */}
      <Button
        type="button"
        variant="custom"
        size="none"
        onClick={handleShareWhatsApp}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-xs font-bold transition-all border border-[#25D366]/30 cursor-pointer"
        aria-label="Compartilhar no WhatsApp"
      >
        <FaWhatsapp className="w-3.5 h-3.5" />
        <Text as="span" className="hidden sm:inline">{PUBLIC_NEWS_TEXTS.SHARE_WHATSAPP}</Text>
      </Button>

      {/* Twitter / X */}
      <Button
        type="button"
        variant="custom"
        size="none"
        onClick={handleShareTwitter}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-hover text-text-primary text-xs font-bold transition-all border border-border cursor-pointer"
        aria-label="Compartilhar no X"
      >
        <FaXTwitter className="w-3.5 h-3.5" />
        <Text as="span" className="hidden sm:inline">{PUBLIC_NEWS_TEXTS.SHARE_TWITTER}</Text>
      </Button>

      {/* Facebook */}
      <Button
        type="button"
        variant="custom"
        size="none"
        onClick={handleShareFacebook}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] text-xs font-bold transition-all border border-[#1877F2]/30 cursor-pointer"
        aria-label="Compartilhar no Facebook"
      >
        <FaFacebookF className="w-3 h-3" />
        <Text as="span" className="hidden sm:inline">{PUBLIC_NEWS_TEXTS.SHARE_FACEBOOK}</Text>
      </Button>

      {/* Copiar Link */}
      <Button
        type="button"
        variant="custom"
        size="none"
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary text-xs font-semibold transition-all border border-border cursor-pointer"
        aria-label={PUBLIC_NEWS_TEXTS.SHARE_COPY}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-primary" />
            <Text as="span" className="text-primary font-bold">{PUBLIC_NEWS_TEXTS.SHARE_COPIED}</Text>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <Text as="span" className="hidden sm:inline">{PUBLIC_NEWS_TEXTS.SHARE_COPY}</Text>
          </>
        )}
      </Button>
    </LayoutContainer>
  );
};

