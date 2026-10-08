export const SYSTEM_MODULES_FEATURE_TEXTS = {
  TITLE: 'Módulos do Sistema',
  SUBTITLE: 'Gerencie quais módulos estão ativos na plataforma.',
  TABLE_HEADERS: {
    MODULE: 'Módulo',
    DESCRIPTION: 'Descrição',
    KEY: 'Chave',
    STATUS: 'Status',
    ACTIONS: 'Ações',
  },
  STATUS: {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
  },
  ACTIONS: {
    DEACTIVATE: 'Desativar',
    ACTIVATE: 'Ativar',
  },
  EMPTY_STATE: 'Nenhum módulo encontrado.',
  MESSAGES: {
    ERROR_LOAD: 'Erro ao carregar módulos do sistema',
    ERROR_TOGGLE: 'Erro ao atualizar status do módulo',
    ACTIVATED: 'ativado',
    DEACTIVATED: 'desativado',
    SUCCESS_TOGGLE: (moduleName: string, actionText: string) => `Módulo ${moduleName} ${actionText} com sucesso`,
  }
};
