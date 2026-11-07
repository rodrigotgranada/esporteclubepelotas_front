import { api } from '@/services/api';

export interface EnvTestResponse {
  stage?: 'PROD' | 'DEV';
  environment?: string;
  databaseSuffix?: string;
  mongoConnected?: boolean;
  storageProvider?: string;
  storageProject?: string;
  storageConfigured?: boolean;
}

export const systemService = {
  getEnvTest: async (): Promise<EnvTestResponse> => {
    const res = await api.get<EnvTestResponse>('/auth/env-test');
    return res.data;
  },
};

