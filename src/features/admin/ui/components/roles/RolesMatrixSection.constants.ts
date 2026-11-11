export interface RolePermissionRow {
  resource: string;
  category: string;
  owner: 'FULL' | 'PARTIAL' | 'NONE';
  admin: 'FULL' | 'PARTIAL' | 'NONE';
  editor: 'FULL' | 'PARTIAL' | 'NONE';
  socio: 'FULL' | 'PARTIAL' | 'NONE';
  user: 'FULL' | 'PARTIAL' | 'NONE';
  notes?: string;
}

export interface RoleUseCaseCard {
  role: string;
  title: string;
  badge: string;
  badgeVariant: 'primary' | 'default';
  description: string;
  examples: string[];
}

export const ROLES_MATRIX_TEXTS = {
  TITLE: 'Matriz Comparativa de Acesso & Casos de Uso',
  SUBTITLE: 'Visão consolidada de direitos, fronteiras de segurança e responsabilidades por perfil de usuário.',
  TAB_ROLES: 'Gestão de Perfis',
  TAB_MATRIX: 'Matriz de Permissões & Casos de Uso',
  COL_RESOURCE: 'Funcionalidade / Módulo',
  COL_OWNER: 'OWNER',
  COL_ADMIN: 'ADMIN',
  COL_EDITOR: 'EDITOR',
  COL_SOCIO: 'SÓCIO',
  COL_USER: 'TORCEDOR',
  STATUS_FULL: 'Total',
  STATUS_PARTIAL: 'Parcial',
  STATUS_NONE: 'Sem Acesso',
};

export const ROLES_PERMISSIONS_DATA: RolePermissionRow[] = [
  {
    resource: 'Gestão de Módulos (Feature Flags Globais)',
    category: 'Governança & TI',
    owner: 'FULL',
    admin: 'NONE',
    editor: 'NONE',
    socio: 'NONE',
    user: 'NONE',
    notes: 'Exclusivo do Owner para ativar/desativar seções do portal.',
  },
  {
    resource: 'Cargos e Permissões do Sistema',
    category: 'Governança & TI',
    owner: 'FULL',
    admin: 'NONE',
    editor: 'NONE',
    socio: 'NONE',
    user: 'NONE',
    notes: 'Apenas o Owner cria novos cargos e gerencia permissões de alto nível.',
  },
  {
    resource: 'Trilha de Auditoria & Histórico de Logs',
    category: 'Governança & TI',
    owner: 'FULL',
    admin: 'FULL',
    editor: 'NONE',
    socio: 'NONE',
    user: 'NONE',
    notes: 'Consulta de auditoria para compliance e segurança operacional.',
  },
  {
    resource: 'Gestão de Usuários e Ativação de Contas',
    category: 'Operações',
    owner: 'FULL',
    admin: 'FULL',
    editor: 'NONE',
    socio: 'NONE',
    user: 'NONE',
    notes: 'Criar, banir, verificar e redefinir senhas de torcedores e staff.',
  },
  {
    resource: 'Moderação de Comentários & Denúncias',
    category: 'Comunicação',
    owner: 'FULL',
    admin: 'FULL',
    editor: 'PARTIAL',
    socio: 'NONE',
    user: 'NONE',
    notes: 'Owner/Admin decidem falsos positivos e ocultam comentários ofensivos.',
  },
  {
    resource: 'Matérias, Notícias, Categorias & Vitrine',
    category: 'Comunicação',
    owner: 'FULL',
    admin: 'FULL',
    editor: 'FULL',
    socio: 'NONE',
    user: 'NONE',
    notes: 'Assessoria de imprensa publica e edita todas as matérias.',
  },
  {
    resource: 'Jogos, Campeonatos & Clubes Adversários',
    category: 'Futebol',
    owner: 'FULL',
    admin: 'FULL',
    editor: 'FULL',
    socio: 'NONE',
    user: 'NONE',
    notes: 'Cadastro de partidas, placares, súmulas e links de transmissão.',
  },
  {
    resource: 'Elencos (Profissional, Base & Feminino)',
    category: 'Futebol',
    owner: 'FULL',
    admin: 'FULL',
    editor: 'FULL',
    socio: 'NONE',
    user: 'NONE',
    notes: 'Gestão completa de atletas, comissão técnica e estatísticas.',
  },
  {
    resource: 'Memorial, Ídolos, Mantos, Hino & Símbolos',
    category: 'Patrimônio',
    owner: 'FULL',
    admin: 'FULL',
    editor: 'FULL',
    socio: 'NONE',
    user: 'NONE',
    notes: 'Manutenção da história e acervo centenário do Lobo.',
  },
  {
    resource: 'Patrocinadores & Segmentação de Apoio',
    category: 'Marketing',
    owner: 'FULL',
    admin: 'FULL',
    editor: 'PARTIAL',
    socio: 'NONE',
    user: 'NONE',
    notes: 'Cadastro de parceiros comerciais para principal, base e feminino.',
  },
  {
    resource: 'Quadro Social (Planos & Benefícios)',
    category: 'Sócios',
    owner: 'FULL',
    admin: 'FULL',
    editor: 'NONE',
    socio: 'PARTIAL',
    user: 'NONE',
    notes: 'Sócio acessa seu próprio plano e carteirinha digital.',
  },
  {
    resource: 'Comentários em Matérias & Denúncias',
    category: 'Interação Pública',
    owner: 'FULL',
    admin: 'FULL',
    editor: 'FULL',
    socio: 'FULL',
    user: 'FULL',
    notes: 'Torcedores logados e ativos podem comentar e denunciar infrações.',
  },
];

export const ROLE_USE_CASES: RoleUseCaseCard[] = [
  {
    role: 'OWNER',
    title: 'Proprietário Master (Presidente / Diretoria de TI)',
    badge: 'Poder Máximo',
    badgeVariant: 'primary',
    description:
      'Responsável legal e administrativo supremo pela plataforma do clube. Possui custódia de todas as permissões críticas do sistema.',
    examples: [
      'Ativar e desativar módulos globais (ex: ligar ou desligar futebol feminino ou loja temporariamente).',
      'Definir políticas de cargos e permissões de segurança.',
      'Auditar o histórico de qualquer mutação crítica realizada por qualquer administrador.',
      'Intervir diretamente em moderação de comentários denunciados.',
    ],
  },
  {
    role: 'ADMIN',
    title: 'Administrador (Gerência Geral / Operações do Clube)',
    badge: 'Gestão Operacional',
    badgeVariant: 'primary',
    description:
      'Braço executivo do clube para o dia a dia. Gerencia usuários, planos de sócios, parceiros e configurações visuais.',
    examples: [
      'Aprovar ou banir cadastros de usuários e torcedores com comportamento suspeito.',
      'Cadastrar e organizar patrocinadores oficiais divididos por modalidades.',
      'Moderar a fila de comentários denunciados (marcar como falso positivo ou ocultar).',
      'Configurar dados institucionais da Boca do Lobo e redes sociais oficiais.',
    ],
  },
  {
    role: 'EDITOR',
    title: 'Editor (Assessoria de Imprensa / Comunicação)',
    badge: 'Jornalismo & Mídia',
    badgeVariant: 'default',
    description:
      'Equipe de comunicação oficial do Pelotas encarregada de manter o torcedor informado com agilidade e qualidade.',
    examples: [
      'Redigir, diagramar e publicar matérias do futebol profissional, base e feminino.',
      'Atualizar o tempo real de jogos (placar, lances e links de transmissão oficial).',
      'Cadastrar novos atletas no elenco e enriquecer a biografia dos ídolos centenários.',
      'Subir fotos oficiais dos mantos da temporada e uniformes históricos.',
    ],
  },
  {
    role: 'SOCIO',
    title: 'Sócio Áureo-Cerúleo (Associado do Clube)',
    badge: 'Torcedor Sócio',
    badgeVariant: 'primary',
    description:
      'Torcedor que apoia financeiramente o Pelotas mensalmente e possui status VIP na comunidade áureo-cerúlea.',
    examples: [
      'Acessar o portal do associado, visualizar carteirinha digital e histórico de mensalidades.',
      'Obter desconto exclusivo em produtos oficiais na Loja Alcateia.',
      'Comentar em matérias de notícias exibindo badge oficial de Sócio ao lado do nome.',
      'Denunciar comentários ofensivos ou spam para a moderação intervir.',
    ],
  },
  {
    role: 'USER',
    title: 'Torcedor Cadastrado (Comunidade do Lobo)',
    badge: 'Público Geral',
    badgeVariant: 'default',
    description:
      'Torcedor que criou sua conta no portal para acompanhar as novidades e interagir com outros pelotenses.',
    examples: [
      'Personalizar seu perfil de torcedor com avatar e dados de contato.',
      'Comentar nas reportagens e matérias com o e-mail verificado.',
      'Denunciar comentários ofensivos que violem as diretrizes éticas da Boca do Lobo.',
      'Acessar links de transmissão de jogos e catálogo da Loja Alcateia.',
    ],
  },
];

