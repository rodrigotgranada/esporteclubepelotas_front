'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { adminIdolsService } from '../../services/admin-idols.service';
import { IdolCategory } from '../../../idols/services/idols.service';
import { ADMIN_IDOLS_TEXTS } from '../../constants/admin-idols.constants';

export const useAdminIdolDrawer = (
  idolId: string | null,
  isOpen: boolean,
  onSaveSuccess: () => void,
) => {
  const texts = ADMIN_IDOLS_TEXTS.DRAWER;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Common Fields
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<IdolCategory>('PLAYER');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [startYear, setStartYear] = useState<number | ''>('');
  const [endYear, setEndYear] = useState<number | ''>('');
  const [isActiveInClub, setIsActiveInClub] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [quote, setQuote] = useState('');
  const [biography, setBiography] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [order, setOrder] = useState<number>(0);

  // Player Fields
  const [position, setPosition] = useState('');
  const [preferredFoot, setPreferredFoot] = useState('Destro');
  const [historicJerseyNumber, setHistoricJerseyNumber] = useState<number | ''>('');
  const [matchesCount, setMatchesCount] = useState<number | ''>('');
  const [goalsCount, setGoalsCount] = useState<number | ''>('');
  const [titlesText, setTitlesText] = useState('');
  const [memorableMatch, setMemorableMatch] = useState('');

  // Coach Fields
  const [coachMatches, setCoachMatches] = useState<number | ''>('');
  const [coachWins, setCoachWins] = useState<number | ''>('');
  const [coachDraws, setCoachDraws] = useState<number | ''>('');
  const [coachLosses, setCoachLosses] = useState<number | ''>('');
  const [coachTitlesText, setCoachTitlesText] = useState('');
  const [tacticalStyle, setTacticalStyle] = useState('');

  // Staff Fields
  const [roleName, setRoleName] = useState('');
  const [yearsOfDedication, setYearsOfDedication] = useState('');
  const [backstageStory, setBackstageStory] = useState('');

  // Fan Fields
  const [stadiumSector, setStadiumSector] = useState('');
  const [trademark, setTrademark] = useState('');

  const resetForm = useCallback(() => {
    setName('');
    setNickname('');
    setSlug('');
    setCategory('PLAYER');
    setPhotoUrl(null);
    setPhotoBlob(null);
    setStartYear('');
    setEndYear('');
    setIsActiveInClub(false);
    setBirthDate('');
    setDeathDate('');
    setBirthPlace('');
    setQuote('');
    setBiography('');
    setIsFeatured(false);
    setOrder(0);
    // Player
    setPosition('');
    setPreferredFoot('Destro');
    setHistoricJerseyNumber('');
    setMatchesCount('');
    setGoalsCount('');
    setTitlesText('');
    setMemorableMatch('');
    // Coach
    setCoachMatches('');
    setCoachWins('');
    setCoachDraws('');
    setCoachLosses('');
    setCoachTitlesText('');
    setTacticalStyle('');
    // Staff
    setRoleName('');
    setYearsOfDedication('');
    setBackstageStory('');
    // Fan
    setStadiumSector('');
    setTrademark('');
  }, []);

  const loadIdol = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        const data = await adminIdolsService.getIdolById(id);
        setName(data.name || '');
        setNickname(data.nickname || '');
        setSlug(data.slug || '');
        setCategory(data.category || 'PLAYER');
        setPhotoUrl(data.photoUrl || null);
        setPhotoBlob(null);
        setStartYear(data.startYear || '');
        setEndYear(data.endYear || '');
        setIsActiveInClub(Boolean(data.isActiveInClub));
        setBirthDate(data.birthDate ? data.birthDate.substring(0, 10) : '');
        setDeathDate(data.deathDate ? data.deathDate.substring(0, 10) : '');
        setBirthPlace(data.birthPlace || '');
        setQuote(data.quote || '');
        setBiography(data.biography || '');
        setIsFeatured(Boolean(data.isFeatured));
        setOrder(data.order ?? 0);

        if (data.playerStats) {
          setPosition(data.playerStats.position || '');
          setPreferredFoot(data.playerStats.preferredFoot || 'Destro');
          setHistoricJerseyNumber(data.playerStats.historicJerseyNumber ?? '');
          setMatchesCount(data.playerStats.matchesCount ?? '');
          setGoalsCount(data.playerStats.goalsCount ?? '');
          setTitlesText(data.playerStats.titles ? data.playerStats.titles.join('\n') : '');
          setMemorableMatch(data.playerStats.memorableMatch || '');
        }

        if (data.coachStats) {
          setCoachMatches(data.coachStats.matchesCount ?? '');
          setCoachWins(data.coachStats.winsCount ?? '');
          setCoachDraws(data.coachStats.drawsCount ?? '');
          setCoachLosses(data.coachStats.lossesCount ?? '');
          setCoachTitlesText(data.coachStats.titles ? data.coachStats.titles.join('\n') : '');
          setTacticalStyle(data.coachStats.tacticalStyle || '');
        }

        if (data.staffStats) {
          setRoleName(data.staffStats.roleName || '');
          setYearsOfDedication(data.staffStats.yearsOfDedication || '');
          setBackstageStory(data.staffStats.backstageStory || '');
        }

        if (data.fanStats) {
          setStadiumSector(data.fanStats.stadiumSector || '');
          setTrademark(data.fanStats.trademark || '');
        }
      } catch (err) {
        console.error('Erro ao carregar dados do ídolo:', err);
        toast.error('Erro ao carregar dados do ídolo.');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (isOpen) {
      if (idolId) {
        loadIdol(idolId);
      } else {
        resetForm();
      }
    }
  }, [isOpen, idolId, loadIdol, resetForm]);

  const handleCropSave = (croppedBlob: Blob) => {
    setPhotoBlob(croppedBlob);
    setPhotoUrl(URL.createObjectURL(croppedBlob));
  };

  const handlePhotoRemove = () => {
    setPhotoBlob(null);
    setPhotoUrl(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('O nome completo do ídolo é obrigatório.');
      return;
    }
    if (!startYear) {
      toast.error('O ano inicial no clube é obrigatório.');
      return;
    }
    if (!biography.trim()) {
      toast.error('A biografia ou história do ídolo é obrigatória.');
      return;
    }

    try {
      setIsSaving(true);

      const payload: any = {
        name: name.trim(),
        nickname: nickname.trim() || undefined,
        category,
        startYear: Number(startYear),
        endYear: endYear ? Number(endYear) : undefined,
        isActiveInClub,
        birthDate: birthDate || undefined,
        deathDate: deathDate || undefined,
        birthPlace: birthPlace.trim() || undefined,
        quote: quote.trim() || undefined,
        biography: biography.trim(),
        isFeatured,
        order: Number(order) || 0,
      };

      if (slug.trim()) payload.slug = slug.trim();

      // Conditional stats by category
      if (category === 'PLAYER') {
        const titles = titlesText
          .split('\n')
          .map((t) => t.trim())
          .filter(Boolean);
        payload.playerStats = {
          position: position.trim() || undefined,
          preferredFoot: preferredFoot.trim() || undefined,
          historicJerseyNumber: historicJerseyNumber ? Number(historicJerseyNumber) : undefined,
          matchesCount: matchesCount ? Number(matchesCount) : 0,
          goalsCount: goalsCount ? Number(goalsCount) : 0,
          titles,
          memorableMatch: memorableMatch.trim() || undefined,
        };
      } else if (category === 'COACH') {
        const titles = coachTitlesText
          .split('\n')
          .map((t) => t.trim())
          .filter(Boolean);
        payload.coachStats = {
          matchesCount: coachMatches ? Number(coachMatches) : 0,
          winsCount: coachWins ? Number(coachWins) : 0,
          drawsCount: coachDraws ? Number(coachDraws) : 0,
          lossesCount: coachLosses ? Number(coachLosses) : 0,
          titles,
          tacticalStyle: tacticalStyle.trim() || undefined,
        };
      } else if (category === 'STAFF') {
        payload.staffStats = {
          roleName: roleName.trim() || undefined,
          yearsOfDedication: yearsOfDedication.trim() || undefined,
          backstageStory: backstageStory.trim() || undefined,
        };
      } else if (category === 'FAN') {
        payload.fanStats = {
          stadiumSector: stadiumSector.trim() || undefined,
          trademark: trademark.trim() || undefined,
        };
      }

      let savedIdolId = idolId;

      if (idolId) {
        await adminIdolsService.updateIdol(idolId, payload);
        toast.success(ADMIN_IDOLS_TEXTS.TOAST.SUCCESS_UPDATE);
      } else {
        const created = await adminIdolsService.createIdol(payload);
        savedIdolId = created._id || created.id;
        toast.success(ADMIN_IDOLS_TEXTS.TOAST.SUCCESS_CREATE);
      }

      // If a new photo was cropped, upload it now
      if (photoBlob && savedIdolId) {
        const file = new File([photoBlob], `${savedIdolId}-photo.webp`, { type: 'image/webp' });
        await adminIdolsService.uploadPhoto(savedIdolId, file);
      }

      onSaveSuccess();
    } catch (err: any) {
      console.error('Erro ao salvar ídolo:', err);
      toast.error(err?.response?.data?.message || ADMIN_IDOLS_TEXTS.TOAST.ERROR_SAVE);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading,
    isSaving,
    name,
    setName,
    nickname,
    setNickname,
    slug,
    setSlug,
    category,
    setCategory,
    photoUrl,
    handleCropSave,
    handlePhotoRemove,
    startYear,
    setStartYear,
    endYear,
    setEndYear,
    isActiveInClub,
    setIsActiveInClub,
    birthDate,
    setBirthDate,
    deathDate,
    setDeathDate,
    birthPlace,
    setBirthPlace,
    quote,
    setQuote,
    biography,
    setBiography,
    isFeatured,
    setIsFeatured,
    order,
    setOrder,
    // Player
    position,
    setPosition,
    preferredFoot,
    setPreferredFoot,
    historicJerseyNumber,
    setHistoricJerseyNumber,
    matchesCount,
    setMatchesCount,
    goalsCount,
    setGoalsCount,
    titlesText,
    setTitlesText,
    memorableMatch,
    setMemorableMatch,
    // Coach
    coachMatches,
    setCoachMatches,
    coachWins,
    setCoachWins,
    coachDraws,
    setCoachDraws,
    coachLosses,
    setCoachLosses,
    coachTitlesText,
    setCoachTitlesText,
    tacticalStyle,
    setTacticalStyle,
    // Staff
    roleName,
    setRoleName,
    yearsOfDedication,
    setYearsOfDedication,
    backstageStory,
    setBackstageStory,
    // Fan
    stadiumSector,
    setStadiumSector,
    trademark,
    setTrademark,
    handleSave,
  };
};
