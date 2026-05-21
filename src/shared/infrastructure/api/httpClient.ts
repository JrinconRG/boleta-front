import axios from 'axios';
import { useAuthStore } from '../../../features/auth/infrastructure/store/useAuthStore';


export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    const err = error instanceof Error ? error : new Error(String(error));
    return Promise.reject(err);
  }
);
httpClient.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: { response?: { status?: number }; } | unknown) => {
    const status = (error && typeof error === 'object' && 'response' in error && (error as any).response?.status) as
      | number
      | undefined;

    if (status === 401) {
      useAuthStore.getState().forceLogout();
    }

    const err = error instanceof Error ? error : new Error(JSON.stringify(error));
    return Promise.reject(err);
  }
);
