import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  MembershipPlan,
  BillingPeriod,
} from '@/features/membership/types/membership.types';
import { membershipService } from '@/features/membership/services/membership.service';
import { MEMBERSHIP_TEXTS } from '@/features/membership/constants/membership.constants';

export interface UseAdminMembershipDrawerProps {
  plan: MembershipPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const useAdminMembershipDrawer = ({
  plan,
  isOpen,
  onClose,
  onSuccess,
}: UseAdminMembershipDrawerProps) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('MENSAL');
  const [advantages, setAdvantages] = useState<string[]>([]);
  const [newAdvantageInput, setNewAdvantageInput] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [highlighted, setHighlighted] = useState(false);
  const [whatsappOverride, setWhatsappOverride] = useState('');
  const [active, setActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (plan) {
        setName(plan.name || '');
        setSlug(plan.slug || '');
        setDescription(plan.description || '');
        setPrice(plan.price || 0);
        setBillingPeriod(plan.billingPeriod || 'MENSAL');
        setAdvantages(plan.advantages ? [...plan.advantages] : []);
        setBadgeText(plan.badgeText || '');
        setHighlighted(Boolean(plan.highlighted));
        setWhatsappOverride(plan.whatsappOverride || '');
        setActive(plan.active !== false);
      } else {
        setName('');
        setSlug('');
        setDescription('');
        setPrice(0);
        setBillingPeriod('MENSAL');
        setAdvantages([
          'Acesso livre à Arquibancada Geral em todos os jogos',
          '10% de desconto na Loja Oficial',
          'Carteirinha oficial digital no portal',
        ]);
        setBadgeText('');
        setHighlighted(false);
        setWhatsappOverride('');
        setActive(true);
      }
      setNewAdvantageInput('');
      setErrorMsg('');
    }
  }, [isOpen, plan]);

  const handleAddAdvantage = () => {
    const trimmed = newAdvantageInput.trim();
    if (!trimmed) return;
    setAdvantages((prev) => [...prev, trimmed]);
    setNewAdvantageInput('');
  };

  const handleRemoveAdvantage = (index: number) => {
    setAdvantages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateAdvantage = (index: number, value: string) => {
    setAdvantages((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('O nome do plano é obrigatório.');
      return;
    }

    if (price < 0 || isNaN(price)) {
      setErrorMsg('O valor do plano não pode ser negativo.');
      return;
    }

    const cleanAdvantages = advantages
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    if (cleanAdvantages.length === 0) {
      setErrorMsg('Adicione pelo menos 1 vantagem para o plano.');
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
        price,
        billingPeriod,
        advantages: cleanAdvantages,
        badgeText: badgeText.trim() || undefined,
        highlighted,
        whatsappOverride: whatsappOverride.trim() || undefined,
        active,
      };

      if (plan?.id) {
        await membershipService.updateAdminPlan(plan.id, payload);
      } else {
        await membershipService.createAdminPlan(payload);
      }

      toast.success(MEMBERSHIP_TEXTS.TOAST_SAVE_SUCCESS);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error('Erro ao salvar plano:', err);
      setErrorMsg('Erro ao salvar plano. Verifique os dados e tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    name,
    setName,
    slug,
    setSlug,
    description,
    setDescription,
    price,
    setPrice,
    billingPeriod,
    setBillingPeriod,
    advantages,
    newAdvantageInput,
    setNewAdvantageInput,
    handleAddAdvantage,
    handleRemoveAdvantage,
    handleUpdateAdvantage,
    badgeText,
    setBadgeText,
    highlighted,
    setHighlighted,
    whatsappOverride,
    setWhatsappOverride,
    active,
    setActive,
    isSaving,
    errorMsg,
    handleSubmit,
  };
};

