import { GlobalSearchGroupKey } from '../types/search.types';

export const GLOBAL_SEARCH_TEXTS = {
  PLACEHOLDER: 'Buscar notícias, atletas, ídolos, jogos...',
  PLACEHOLDER_COMPACT: 'Buscar no portal...',
  MIN_CHARS_HINT: 'Digite pelo menos 2 caracteres para buscar no portal.',
  LOADING: 'Buscando no portal áureo-cerúleo...',
  ERROR_MESSAGE: 'Não foi possível concluir a busca agora. Tente novamente.',
  EMPTY_TITLE: 'Nenhum resultado encontrado',
  EMPTY_DESCRIPTION: 'Tente buscar por outro nome de atleta, notícia, adversário ou documento.',
  OPEN_SEARCH_ARIA: 'Abrir busca global no portal',
  OPEN_SEARCH_TITLE: 'Buscar no portal (Ctrl+K)',
  CLOSE_SEARCH_ARIA: 'Fechar busca global',
  CLEAR_SEARCH_ARIA: 'Limpar texto da busca',
  SEARCH_INPUT_ARIA: 'Campo de busca global do portal',
  SHORTCUT_HINT: 'ESC para fechar',
  GROUP_LABELS: {
    news: 'Notícias & Matérias',
    athletes: 'Elenco & Comissão Técnica',
    idols: 'Galeria de Ídolos',
    matches: 'Jogos & Campeonatos',
    transparency: 'Portal da Transparência',
  } as Record<GlobalSearchGroupKey, string>,
};

