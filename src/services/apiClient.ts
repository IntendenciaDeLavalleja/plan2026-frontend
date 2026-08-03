import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { API_URL } from '@/config/env';

function createApiClient(withCredentials: boolean): AxiosInstance {
  const client = axios.create({
    baseURL: API_URL,
    withCredentials,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    timeout: 30000,
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.data && typeof error.response.data === 'object') {
        const data = error.response.data as { error?: { message?: string; code?: string } };
        if (data.error) {
          const message = data.error.message ?? 'Error en la solicitud';
          const code = data.error.code ?? 'error';
          return Promise.reject(new ApiError(message, code, error.response.status, data.error));
        }
      }
      return Promise.reject(
        new ApiError(error.message || 'Error de red', 'network_error', error.response?.status ?? 0),
      );
    },
  );

  return client;
}

export const publicApiClient = createApiClient(false);
export const adminApiClient = createApiClient(true);

export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(message: string, code: string, status: number, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

async function getOk<T>(client: AxiosInstance, config: AxiosRequestConfig): Promise<T> {
  const res = await client.request<{ ok: true; data: T }>(config);
  return res.data.data;
}

export function getPublicOk<T>(config: AxiosRequestConfig): Promise<T> {
  return getOk<T>(publicApiClient, config);
}

export function getAdminOk<T>(config: AxiosRequestConfig): Promise<T> {
  return getOk<T>(adminApiClient, config);
}
