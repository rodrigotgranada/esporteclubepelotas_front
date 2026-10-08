export const formatCPF = (cpf: string | undefined | null): string => {
  if (!cpf) return '';
  const numericCPF = cpf.replace(/\D/g, '');
  if (numericCPF.length !== 11) return cpf;
  
  return numericCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};
