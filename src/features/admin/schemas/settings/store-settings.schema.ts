import { z } from 'zod';

export const storeSettingsSchema = z.object({
  storeName: z.string().min(1, 'Nome da loja é obrigatório'),
  storeDescription: z.string().optional(),
  storeFacadeUrl: z.string().optional().nullable(),
  storeExternalUrl: z
    .string()
    .refine((val) => !val || val === '' || /^https?:\/\/.+/.test(val), {
      message: 'Insira uma URL válida (ex: https://...)',
    })
    .optional(),
  storeIsOnlineActive: z.boolean(),
  storeInstagramUrl: z
    .string()
    .refine((val) => !val || val === '' || /^https?:\/\/.+/.test(val), {
      message: 'Insira um link do Instagram válido (ex: https://instagram.com/...)',
    })
    .optional(),
  storeInstagramDescription: z.string().optional(),
  storeWhatsappNumber: z.string().optional(),
  storeWhatsappDescription: z.string().optional(),
  storeWhatsappMessage: z.string().optional(),
  storeOpeningHours: z.string().optional(),
  storeAddress: z.string().optional(),
  storeHasMemberDiscount: z.boolean(),
  storeMemberDiscountText: z.string().optional(),
});

export type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;
