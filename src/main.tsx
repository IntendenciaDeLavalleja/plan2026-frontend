import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AppThemeProvider } from '@/providers/AppThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { queryClient } from '@/services/queryClient';
import App from '@/app/App';
import '@/styles/global.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('No se encontró el contenedor raíz #root');
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </AppThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
