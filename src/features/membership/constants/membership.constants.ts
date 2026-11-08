export const MEMBERSHIP_TEXTS = {
  // Hero
  HERO_BADGE: 'QUADRO SOCIAL OFICIAL',
  HERO_TITLE: 'Jogue junto com o Lobo dentro e fora de campo',
  HERO_SUBTITLE:
    'Ser sócio do Esporte Clube Pelotas é mais que apoiar: é carregar o manto áureo-cerúleo no peito, garantir seu lugar na Boca do Lobo e construir um clube cada vez mais forte.',
  HERO_CTA_SCROLL: 'Conhecer Planos',
  HERO_STATS_MATCHES: 'Acesso garantido aos jogos',
  HERO_STATS_DISCOUNT: 'Até 15% de desconto na loja',
  HERO_STATS_TRADITION: 'Desde 1908 fazendo história',

  // ElevenTickets Oficial Banner
  ELEVENTICKETS_BANNER_BADGE: 'SISTEMA OFICIAL EM OPERAÇÃO',
  ELEVENTICKETS_BANNER_TITLE: 'Quadro Social Oficial operando via ElevenTickets',
  ELEVENTICKETS_BANNER_DESC:
    'O Esporte Clube Pelotas utiliza oficialmente a plataforma parceira ElevenTickets para a emissão de carteirinhas, planos e mensalidades. Clique abaixo para ser direcionado ao portal oficial ou explore a vitrine de planos abaixo.',
  ELEVENTICKETS_BANNER_BUTTON: 'Acessar ElevenTickets Oficial',

  // Grid
  PLANS_SECTION_BADGE: 'PLANOS DE SÓCIO',
  PLANS_SECTION_TITLE: 'Escolha o plano ideal para a sua paixão',
  PLANS_SECTION_SUBTITLE: 'Planos acessíveis com vantagens exclusivas para todos os perfis de torcedores áureo-cerúleos.',
  FEATURED_BADGE: 'MAIS ESCOLHIDO',
  PERIOD_LABEL_MONTH: '/mês',
  PERIOD_LABEL_TRIMESTER: '/trimestre',
  PERIOD_LABEL_SEMESTER: '/semestre',
  PERIOD_LABEL_YEAR: '/ano',
  BUTTON_VIEW_DETAILS: 'Ver Vantagens & Assinar',
  NO_PLANS_AVAILABLE: 'Nenhum plano disponível no momento.',
  LOADING_PLANS: 'Carregando opções do Quadro Social...',

  // Modal Detalhes
  MODAL_DETAILS_TITLE: 'Detalhes do Plano',
  MODAL_ADVANTAGES_TITLE: 'Vantagens inclusas neste plano:',
  MODAL_BUTTON_SUBSCRIBE: 'Quero Contratar este Plano',
  MODAL_WHATSAPP_HINT: 'Atendimento humanizado direto com a Secretaria do Pelotas via WhatsApp.',

  // Modal Lead Rápido
  LEAD_MODAL_TITLE: 'Quase lá! Confirme seus dados',
  LEAD_MODAL_SUBTITLE: 'Para agilizar seu atendimento na secretaria, informe seus dados de identificação:',
  LEAD_LABEL_NAME: 'Nome Completo',
  LEAD_PLACEHOLDER_NAME: 'Ex: Rodrigo Silva Granada',
  LEAD_LABEL_PHONE: 'WhatsApp com DDD',
  LEAD_PLACEHOLDER_PHONE: '(53) 99999-9999',
  LEAD_LABEL_CPF: 'CPF (opcional)',
  LEAD_PLACEHOLDER_CPF: '000.000.000-00',
  LEAD_LABEL_EMAIL: 'E-mail para contato',
  LEAD_PLACEHOLDER_EMAIL: 'seu.email@exemplo.com',
  LEAD_BUTTON_SUBMIT: 'Continuar no WhatsApp da Secretaria',
  LEAD_SUBMITTING: 'Conectando à secretaria...',
  LEAD_DATA_SECURITY: 'Seus dados serão utilizados exclusivamente pela secretaria do clube para formalizar sua adesão.',

  // Admin
  ADMIN_TITLE: 'Quadro Social & Planos de Sócios',
  ADMIN_SUBTITLE: 'Gerencie os planos de associação, vantagens e acompanhe os torcedores interessados.',
  ADMIN_TAB_PLANS: 'Planos de Sócios',
  ADMIN_TAB_LEADS: 'Leads & Contatos de Adesão',
  ADMIN_NEW_PLAN: 'Novo Plano',
  ADMIN_EMPTY_LEADS: 'Nenhum lead de adesão registrado até o momento.',
  ADMIN_EMPTY_PLANS: 'Nenhum plano cadastrado.',
  ADMIN_CONFIRM_DELETE_TITLE: 'Excluir Plano',
  ADMIN_CONFIRM_DELETE_MSG: 'Tem certeza que deseja inativar este plano? Os leads vinculados permanecerão salvos.',

  // Status
  STATUS_NEW: 'Novo',
  STATUS_CONTACTED: 'Contatado',
  STATUS_CONVERTED: 'Convertido',
  STATUS_CANCELLED: 'Cancelado',

  // Toasts
  TOAST_LEAD_SUCCESS: 'Intenção registrada! Abrindo WhatsApp da secretaria...',
  TOAST_SAVE_SUCCESS: 'Plano salvo com sucesso!',
  TOAST_DELETE_SUCCESS: 'Plano excluído com sucesso!',
  TOAST_STATUS_SUCCESS: 'Status do lead atualizado com sucesso!',
  TOAST_GENERIC_ERROR: 'Ocorreu um erro ao processar a solicitação.',
} as const;

export interface FaqItem {
  question: string;
  answer: string;
}

export const MEMBERSHIP_FAQS: FaqItem[] = [
  {
    question: 'Como funciona o acesso aos jogos na Boca do Lobo?',
    answer:
      'Os sócios em dia com planos que contemplam acesso ao estádio recebem a carteirinha (física ou digital) e têm entrada liberada nas catracas exclusivas de sócios na Boca do Lobo em todos os jogos com mando de campo do Pelotas.',
  },
  {
    question: 'Como faço para retirar minha carteirinha física?',
    answer:
      'Após a confirmação da sua adesão e do primeiro pagamento junto à secretaria, sua carteirinha física fica disponível para retirada na secretaria da Boca do Lobo em horário comercial, ou você já pode utilizar a versão digital no portal.',
  },
  {
    question: 'Quais são as formas de pagamento aceitas pela secretaria?',
    answer:
      'A secretaria do Esporte Clube Pelotas aceita pagamento via Pix (com confirmação instantânea), boleto bancário e cartão de crédito/débito. No plano anual, é possível parcelar no cartão ou ter condições especiais no Pix à vista.',
  },
  {
    question: 'Moro fora de Pelotas ou no exterior. Qual o melhor plano para mim?',
    answer:
      'O plano "Sócio Longe da Boca" foi desenhado especificamente para torcedores que residem no interior do estado, em outros estados ou no exterior, oferecendo carteirinha digital, descontos na loja online e ingressos livres nas visitas à Boca do Lobo.',
  },
  {
    question: 'Posso incluir dependentes no meu plano?',
    answer:
      'Sim! O Pelotas possui modalidades para inclusão de dependentes (cônjuge e filhos) e o plano "Lobinho Mirim" para crianças de até 12 anos. Ao chamar a secretaria no WhatsApp, solicite a adição de dependentes.',
  },
];

/**
 * Monta o link para o WhatsApp oficial com mensagem amigável pré-preenchida
 */
export const buildMembershipWhatsAppUrl = (params: {
  phone: string;
  planName: string;
  planPrice: number;
  billingPeriod: string;
  userName: string;
  userPhone: string;
  userCpf?: string | null;
  userEmail: string;
}): string => {
  const cleanPhone = params.phone.replace(/\D/g, '');
  const periodText =
    params.billingPeriod.toUpperCase() === 'ANUAL'
      ? 'ano'
      : params.billingPeriod.toUpperCase() === 'SEMESTRAL'
      ? 'semestre'
      : 'mês';

  const formattedPrice = params.planPrice.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const lines = [
    `🐺 *Olá, Secretaria do Esporte Clube Pelotas!*`,
    ``,
    `Gostaria de formalizar minha adesão ao Quadro Social!`,
    `📌 *Plano Escolhido:* ${params.planName} (${formattedPrice}/${periodText})`,
    ``,
    `👤 *Meus Dados:*`,
    `• *Nome:* ${params.userName}`,
    `• *Telefone/WhatsApp:* ${params.userPhone}`,
    params.userCpf ? `• *CPF:* ${params.userCpf}` : null,
    `• *E-mail:* ${params.userEmail}`,
    ``,
    `Como posso concluir o cadastro e efetuar o pagamento da minha mensalidade?`,
  ].filter(Boolean);

  const message = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${cleanPhone}?text=${message}`;
};

