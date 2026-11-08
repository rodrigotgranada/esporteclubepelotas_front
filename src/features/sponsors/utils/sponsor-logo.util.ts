/**
 * Resolve o logotipo adequado do patrocinador conforme o tema ativo (claro ou escuro),
 * aplicando fallback automático mútuo caso apenas uma imagem tenha sido cadastrada.
 */
export const resolveSponsorLogo = (
  sponsor?: {
    logoUrl?: string | null;
    logoDarkUrl?: string | null;
  } | null,
  isDark = false,
): string => {
  if (!sponsor) return '/images/pelotas-logo.png';

  const light = sponsor.logoUrl?.trim() || '';
  const dark = sponsor.logoDarkUrl?.trim() || '';

  if (isDark) {
    return dark || light || '/images/pelotas-logo.png';
  }
  return light || dark || '/images/pelotas-logo.png';
};
