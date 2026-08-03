import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';

const baseURL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

apiClient.interceptors.response.use(
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

export async function getOk<T>(config: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.request<{ ok: true; data: T }>(config);
  return res.data.data;
}
