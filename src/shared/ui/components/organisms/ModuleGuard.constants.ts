export const MODULE_GUARD_TEXTS = {
  BADGE: 'Módulo Indisponível',
  TITLE: 'Esta seção está temporariamente desativada',
  DESCRIPTION: (moduleName?: string) =>
    moduleName
      ? `A área de ${moduleName} do portal do Esporte Clube Pelotas está em atualização ou temporariamente desativada pela diretoria.`
      : 'Esta área do portal do Esporte Clube Pelotas está em atualização ou temporariamente desativada pela diretoria.',
  BACK_HOME: 'Voltar para a Página Inicial',
  LOADING: 'Verificando disponibilidade do módulo...',
};

