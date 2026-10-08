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
  CORE_MODULES: [
    { slug: 'roles', name: 'Cargos e Permissões' },
    { slug: 'modules', name: 'Módulos do Sistema' },
    { slug: 'settings', name: 'Configurações Globais' },
    { slug: 'themes', name: 'Gestão de Temas' },
  ],
  CRUD_ACTIONS: [
    { action: 'read', label: 'Ler' },
    { action: 'create', label: 'Criar' },
    { action: 'update', label: 'Editar' },
    { action: 'delete', label: 'Excluir' },
  ]
};
