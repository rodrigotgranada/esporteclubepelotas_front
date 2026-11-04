import { NewsArticleData } from '@/features/admin/services/admin-news.service';

/**
 * Extrai texto de nós recursivos do Tiptap JSON
 */
function extractTextFromTiptap(node: any): string {
  if (!node) return '';
  if (node.text) return node.text;
  if (Array.isArray(node.content)) {
    return node.content.map(extractTextFromTiptap).join(' ');
  }
  return '';
}

/**
 * Calcula o tempo estimado de leitura em minutos com base no conteúdo da matéria.
 * Média padrão: 200 palavras por minuto.
 */
export function calculateReadingTime(article: Partial<NewsArticleData>): string {
  let text = '';

  if (article.content) {
    if (typeof article.content === 'string') {
      text = article.content;
    } else {
      text = extractTextFromTiptap(article.content);
    }
  }

  if (!text && article.summary) {
    text = article.summary;
  }

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} min de leitura`;
}

/**
 * Retorna o nome da categoria de forma segura
 */
export function getCategoryName(category: any): string {
  if (!category) return 'Geral';
  if (typeof category === 'string') return category;
  return category.name || 'Geral';
}

/**
 * Formata a data da matéria em pt-BR
 */
export function formatNewsDate(dateStr?: string, includeTime = false): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    return d.toLocaleDateString('pt-BR', options);
  } catch {
    return dateStr;
  }
}

/**
 * Extrai o ID do vídeo do YouTube e retorna a URL de incorporação segura (youtube-nocookie.com/embed/ID).
 * Suporta formatos desktop, mobile (m.youtube), compartilhamento do app (youtu.be), Shorts e transmissões ao vivo.
 */
export function getYoutubeEmbedUrl(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();
  if (!cleanUrl) return null;

  const regex = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/;
  const match = cleanUrl.match(regex);
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}`;
  }
  return null;
}

/**
 * Retorna o link canônico do YouTube para assistir externamente no app ou navegador.
 */
export function getYoutubeWatchUrl(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();
  if (!cleanUrl) return null;

  const regex = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/;
  const match = cleanUrl.match(regex);
  if (match && match[1]) {
    return `https://www.youtube.com/watch?v=${match[1]}`;
  }
  return null;
}

