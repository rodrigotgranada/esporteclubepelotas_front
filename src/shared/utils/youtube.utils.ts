/**
 * Canal Oficial do Pelotas no YouTube (ECP TV):
 * Handle: @ECPTV-j9m / @ecpelotasoficial
 * Channel ID: UCYGjto6__L5Gbapl_fwdKtw
 */
export const PELOTAS_OFFICIAL_YOUTUBE_CHANNEL_ID = 'UCYGjto6__L5Gbapl_fwdKtw';

/**
 * Converte qualquer URL do YouTube (vídeo, live, shorts, embed, canal com live)
 * em uma URL de embed 100% segura e compatível com iframes.
 */
export const getYouTubeEmbedUrl = (url?: string | null): string | null => {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    // 1. Já é uma URL de embed válida
    if (trimmed.includes('youtube.com/embed/') || trimmed.includes('youtube-nocookie.com/embed/')) {
      return trimmed;
    }

    // 2. Formato de vídeo direto: watch?v=ID, youtu.be/ID, live/ID, shorts/ID, v/ID
    const videoPatterns = [
      /[?&]v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of videoPatterns) {
      const match = trimmed.match(pattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
      }
    }

    // 3. Canal com Channel ID direto: /channel/(UC...) ou ?channel=(UC...)
    const channelIdMatch =
      trimmed.match(/channel\/(UC[a-zA-Z0-9_-]{22})/i) ||
      trimmed.match(/channel=(UC[a-zA-Z0-9_-]{22})/i);
    if (channelIdMatch && channelIdMatch[1]) {
      return `https://www.youtube.com/embed/live_stream?channel=${channelIdMatch[1]}&autoplay=0`;
    }

    // 4. Se for o canal oficial do Pelotas por handle (@ecpelotasoficial, @ECPTV, etc.)
    if (
      trimmed.includes('@ecpelotasoficial') ||
      trimmed.includes('@ECPTV') ||
      trimmed.includes('/c/ecpelotas')
    ) {
      return `https://www.youtube.com/embed/live_stream?channel=${PELOTAS_OFFICIAL_YOUTUBE_CHANNEL_ID}&autoplay=0`;
    }

    return null;
  } catch {
    return null;
  }
};

