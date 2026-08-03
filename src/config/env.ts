export function resolveApiUrl(rawApiUrl: string | undefined): string {
  if (!rawApiUrl?.trim()) {
    throw new Error(
      'Falta la variable obligatoria VITE_API_URL. Configúrala con la URL completa del backend, por ejemplo https://backend.example.com/api/v1.',
    );
  }

  let parsed: URL;

  try {
    parsed = new URL(rawApiUrl.trim());
  } catch {
    throw new Error('VITE_API_URL debe ser una URL absoluta HTTP o HTTPS.');
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error(`VITE_API_URL utiliza un protocolo inválido: ${parsed.protocol}`);
  }

  parsed.pathname = parsed.pathname.replace(/\/+$/, '');
  parsed.search = '';
  parsed.hash = '';
  return parsed.toString().replace(/\/+$/, '');
}

export const API_URL = resolveApiUrl(import.meta.env.VITE_API_URL);
