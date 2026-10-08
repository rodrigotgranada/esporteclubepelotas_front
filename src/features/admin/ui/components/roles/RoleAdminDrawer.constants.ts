export const ROLE_ADMIN_DRAWER_TEXTS = {
  TITLE_EDIT: 'Editar Cargo',
  TITLE_CREATE: 'Criar Novo Cargo',
  LABEL_NAME: 'Chave Técnica do Cargo',
  PLACEHOLDER_NAME: 'Ex: MODERADOR',
  LABEL_LABEL: 'Nome de Exibição (Label)',
  PLACEHOLDER_LABEL: 'Ex: Moderador da Comunidade',
  LABEL_DESCRIPTION: 'Descrição',
  PLACEHOLDER_DESCRIPTION: 'Ex: Pode gerenciar notícias e usuários.',
  PERMISSIONS_TITLE: 'Permissões de Acesso',
  OWNER_WARNING: 'O cargo OWNER possui acesso total ao sistema de forma nativa e suas permissões não podem ser removidas.',
  BUTTON_CANCEL: 'Cancelar',
  BUTTON_SAVE: 'Salvar',
  MESSAGES: {
    SUCCESS_UPDATE: 'Cargo atualizado com sucesso!',
    SUCCESS_CREATE: 'Cargo criado com sucesso!',
    ERROR_SAVE: 'Erro ao salvar cargo',
  },
  AVAILABLE_PERMISSIONS: [
    { module: 'Usuários', key: 'users.manage', description: 'Gestão completa (listar, criar, editar, excluir)' },
    { module: 'Cargos', key: 'roles.manage', description: 'Gestão completa (listar, criar, editar, excluir)' },
    { module: 'Módulos', key: 'modules.manage', description: 'Ligar e desligar módulos do sistema' },
    { module: 'Matérias', key: 'news.manage', description: 'Gestão completa (publicar, editar, excluir)' },
  ]
};
