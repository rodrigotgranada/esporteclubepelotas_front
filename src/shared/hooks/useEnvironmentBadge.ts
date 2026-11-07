import { useEffect, useState, useRef } from 'react';
import { systemService, EnvTestResponse } from '@/services/system.service';

export const useEnvironmentBadge = () => {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [envData, setEnvData] = useState<EnvTestResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      try {
        const data = await systemService.getEnvTest();
        if (!isMounted) return;
        const resolvedStage: 'PROD' | 'DEV' =
          data.stage ||
          (data.databaseSuffix === 'ecp_prod' ? 'PROD' : 'DEV');

        setEnvData({ ...data, stage: resolvedStage });
        setStatus(data.mongoConnected === false ? 'error' : 'ok');
      } catch {
        if (!isMounted) return;
        setStatus('error');
      }
    };

    checkConnection();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    status,
    envData,
    isOpen,
    setIsOpen,
    containerRef,
  };
};

