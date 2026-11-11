export const TRANSPARENCY_TEXTS = {
  PAGE_TITLE: 'Transparência & Governança',
  PAGE_SUBTITLE: 'Prestação de contas, estatuto social, balanços patrimoniais e conselhos diretivos do Esporte Clube Pelotas.',
  HERO_BADGE: 'GESTÃO E COMPROMISSO',
  HERO_TITLE: 'Portal da Transparência',
  HERO_DESCRIPTION: 'Em respeito à imensa torcida áureo-cerúlea e aos sócios do clube, disponibilizamos publicamente todos os documentos contábeis, relatórios de auditoria, atas oficiais e a composição dos conselhos do Pelotas.',
  
  TABS: {
    ALL: 'Todos os Documentos',
    ESTATUTO: 'Estatuto & Regimentos',
    BALANCO: 'Balanços Patrimoniais',
    FINANCEIRO: 'Relatórios Financeiros',
    ATA: 'Atas de Reuniões',
    BOARD: 'Diretoria & Conselhos',
  },

  FILTER_YEAR: 'Filtrar por Ano',
  ALL_YEARS: 'Todos os Anos',
  DOWNLOAD_FILE: 'Baixar Documento',
  EMPTY_DOCUMENTS: 'Nenhum documento encontrado para os filtros selecionados.',
  LOADING_DOCUMENTS: 'Carregando documentos oficiais...',
  
  BOARD_SECTIONS: {
    DIRETORIA_EXECUTIVA: 'Diretoria Executiva',
    CONSELHO_DELIBERATIVO: 'Conselho Deliberativo',
    CONSELHO_FISCAL: 'Conselho Fiscal',
  },

  ADMIN: {
    PAGE_TITLE: 'Gestão de Transparência & Governança',
    PAGE_SUBTITLE: 'Gerencie balanços, relatórios contábeis, estatuto e a diretoria do clube.',
    TAB_DOCS: 'Documentos Oficiais',
    TAB_BOARD: 'Diretoria & Conselhos',
    NEW_DOC_BUTTON: 'Novo Documento',
    NEW_MEMBER_BUTTON: 'Novo Membro',
    
    TABLE_TITLE: 'Título',
    TABLE_CATEGORY: 'Categoria',
    TABLE_YEAR: 'Ano',
    TABLE_STATUS: 'Status',
    TABLE_ACTIONS: 'Ações',
    
    STATUS_PUBLISHED: 'Publicado',
    STATUS_DRAFT: 'Rascunho',
    STATUS_ACTIVE: 'Ativo',
    STATUS_INACTIVE: 'Inativo',
    
    DRAWER_DOC_CREATE_TITLE: 'Publicar Documento',
    DRAWER_DOC_EDIT_TITLE: 'Editar Documento',
    DRAWER_MEMBER_CREATE_TITLE: 'Cadastrar Membro',
    DRAWER_MEMBER_EDIT_TITLE: 'Editar Membro',
    
    LABEL_TITLE: 'Título do Documento',
    LABEL_DESCRIPTION: 'Descrição Resumida',
    LABEL_CATEGORY: 'Categoria Institucional',
    LABEL_YEAR: 'Ano de Exercício',
    LABEL_FILE: 'Arquivo PDF Oficial',
    LABEL_PUBLISHED: 'Publicar no Portal',
    
    LABEL_MEMBER_NAME: 'Nome Completo',
    LABEL_MEMBER_ROLE: 'Cargo / Função',
    LABEL_MEMBER_BOARD: 'Conselho / Órgão',
    LABEL_MEMBER_TERM: 'Período do Mandato (Ex: 2025 - 2026)',
    LABEL_MEMBER_PHOTO: 'Foto do Membro (Opcional)',
    LABEL_MEMBER_ORDER: 'Ordem de Exibição',
    LABEL_MEMBER_ACTIVE: 'Membro em Exercício',
    
    SAVE_SUCCESS: 'Documento salvo com sucesso!',
    DELETE_SUCCESS: 'Documento excluído com sucesso!',
    MEMBER_SAVE_SUCCESS: 'Membro salvo com sucesso!',
    MEMBER_DELETE_SUCCESS: 'Membro excluído com sucesso!',
    UPLOAD_ERROR: 'Falha no upload do arquivo PDF.',
  }
} as const;

export const TRANSPARENCY_CATEGORIES = [
  { value: 'ESTATUTO', label: 'Estatuto & Regimentos' },
  { value: 'BALANCO', label: 'Balanço Patrimonial' },
  { value: 'FINANCEIRO', label: 'Relatório Financeiro' },
  { value: 'ATA', label: 'Ata de Reunião' },
  { value: 'OUTRO', label: 'Outro Documento' },
] as const;

export const BOARD_TYPES = [
  { value: 'DIRETORIA_EXECUTIVA', label: 'Diretoria Executiva' },
  { value: 'CONSELHO_DELIBERATIVO', label: 'Conselho Deliberativo' },
  { value: 'CONSELHO_FISCAL', label: 'Conselho Fiscal' },
] as const;

