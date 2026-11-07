import { updateStadiumSchema } from './stadium.schema';

describe('Stadium Schema Validation', () => {
  const validData = {
    title: 'Estádio Boca do Lobo',
    subtitle: 'A Fortaleza Centenária',
    coverImageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2',
    inaugurationDate: '25 de Outubro de 1908',
    capacity: '23.336 espectadores',
    pitchDimensions: '105m x 68m',
    address: 'Av. Bento Gonçalves, Pelotas - RS',
    mapsDirectUrl: 'https://maps.google.com',
    mapsEmbedUrl: 'https://maps.google.com/embed',
    contentHtml: '<p>História completa da Boca do Lobo e do Pelotas.</p>',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1',
        caption: 'Vista aérea',
        order: 1,
      },
    ],
    facts: [
      {
        year: '1908',
        title: 'Inauguração',
        description: 'Primeira partida oficial',
      },
    ],
    isActive: true,
  };

  it('deve validar com sucesso um payload completo de estádio', () => {
    const result = updateStadiumSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('deve rejeitar título com menos de 3 caracteres', () => {
    const invalid = { ...validData, title: 'EL' };
    const result = updateStadiumSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('deve rejeitar conteúdo de história com menos de 10 caracteres', () => {
    const invalid = { ...validData, contentHtml: '<p>Oi</p>' };
    const result = updateStadiumSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('deve validar galeria vazia e fatos vazios', () => {
    const emptyLists = { ...validData, gallery: [], facts: [] };
    const result = updateStadiumSchema.safeParse(emptyLists);
    expect(result.success).toBe(true);
  });
});

