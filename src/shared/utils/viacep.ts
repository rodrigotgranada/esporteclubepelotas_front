export interface ViaCepAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const fetchViaCEP = async (zipCode: string): Promise<ViaCepAddress | null> => {
  const cleanZip = (zipCode || '').replace(/\D/g, '');
  if (cleanZip.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleanZip}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;
    return data as ViaCepAddress;
  } catch {
    return null;
  }
};

