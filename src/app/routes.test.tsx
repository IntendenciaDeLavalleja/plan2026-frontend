import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SSRProvider } from '@fluentui/react-components';
import { describe, expect, it, vi } from 'vitest';
import { AppThemeProvider } from '@/providers/AppThemeProvider';

vi.mock('@/providers/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) =>
    createElement('div', { 'data-admin-auth-provider': 'true' }, children),
  useAuth: () => ({ user: null, loading: false }),
}));

import { AppRoutes } from './routes';

function renderRoute(path: string) {
  const queryClient = new QueryClient();
  return renderToStaticMarkup(
    createElement(
      SSRProvider,
      null,
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(
          AppThemeProvider,
          null,
          createElement(MemoryRouter, { initialEntries: [path] }, createElement(AppRoutes)),
        ),
      ),
    ),
  );
}

describe('route authentication boundaries', () => {
  it('does not mount administrative authentication for the public booking route', () => {
    expect(renderRoute('/agendar')).not.toContain('data-admin-auth-provider="true"');
  });

  it('mounts administrative authentication for the administrative route tree', () => {
    expect(renderRoute('/admin')).toContain('data-admin-auth-provider="true"');
  });
});
