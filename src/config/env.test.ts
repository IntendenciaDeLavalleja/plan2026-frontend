import { describe, expect, it } from 'vitest';
import { resolveApiUrl } from './env';

describe('VITE_API_URL', () => {
  it('normalizes an absolute API URL without changing its path', () => {
    expect(resolveApiUrl('https://api.example.com/api/v1///?ignored=true#section')).toBe(
      'https://api.example.com/api/v1',
    );
  });

  it('fails explicitly when the variable is missing or invalid', () => {
    expect(() => resolveApiUrl('')).toThrow('Falta la variable obligatoria VITE_API_URL');
    expect(() => resolveApiUrl('ftp://api.example.com/api/v1')).toThrow('protocolo inválido');
  });
});
