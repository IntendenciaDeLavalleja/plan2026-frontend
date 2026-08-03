import { describe, expect, it } from 'vitest';
import { adminApiClient, publicApiClient } from './apiClient';

describe('API clients', () => {
  it('uses the centralized, versioned API URL', () => {
    const expectedBaseUrl = 'https://api.test.example.com/api/v1';
    expect(publicApiClient.defaults.baseURL).toBe(expectedBaseUrl);
    expect(adminApiClient.defaults.baseURL).toBe(expectedBaseUrl);
    expect(publicApiClient.getUri({ url: '/public/tribute-types' })).toBe(
      `${expectedBaseUrl}/public/tribute-types`,
    );
    expect(adminApiClient.getUri({ url: '/admin/auth/me' })).toBe(
      `${expectedBaseUrl}/admin/auth/me`,
    );
  });

  it('keeps credentials limited to administrative requests', () => {
    expect(publicApiClient.defaults.withCredentials).toBe(false);
    expect(adminApiClient.defaults.withCredentials).toBe(true);
  });
});
