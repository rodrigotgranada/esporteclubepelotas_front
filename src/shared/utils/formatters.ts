export const formatCPF = (cpf: string | undefined | null): string => {
  if (!cpf) return '';
  const numericCPF = cpf.replace(/\D/g, '');
  if (numericCPF.length !== 11) return cpf;
  
  return numericCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatCEP = (cep: string | undefined | null): string => {
  if (!cep) return '';
  const digits = cep.replace(/\D/g, '').substring(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};
