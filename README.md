# Frontend — Amnistía Financiera (Fluent UI 2)

Aplicación web para la agenda electrónica. Construida con React 19, TypeScript,
Vite 7 y **Fluent UI 2** (`@fluentui/react-components`).

## Características

- Portal público con wizard de reserva, búsqueda de turnos y requisitos.
- Panel administrativo con dashboard, tributos, disponibilidad, agenda,
  sedes y configuración.
- Tema claro y oscuro con `FluentProvider` (`webLightTheme` / `webDarkTheme`).
- Persistencia de preferencia en `localStorage`, respeta
  `prefers-color-scheme` en el primer ingreso.
- TypeScript estricto, ESLint, build verificado (`tsc -b && vite build`).

## Scripts

```bash
npm install --legacy-peer-deps    # instalar dependencias
npm run dev                       # arrancar en modo desarrollo (puerto 5173)
npm run build                     # build de producción
npm run preview                   # servir build
npm run lint                      # ESLint
```

## Variables de entorno

Crear un archivo `.env` en la raíz de `frontend/`:

```
VITE_API_URL=https://mapi.sgdm.lavalleja.uy/api/v1
```

La variable es obligatoria, se incorpora al bundle durante `npm run build` y
debe contener una URL absoluta. Para cambiar de backend, actualizar sólo
`VITE_API_URL` y reconstruir la aplicación.

## Comunicación con la API

El navegador llama directamente al backend configurado. El backend debe
autorizar el origen del frontend mediante `CORS_ALLOWED_ORIGINS`; Nginx sólo
sirve la SPA y no actúa como proxy de API.

## Estructura

Ver `../README.md` para la estructura general. Aquí lo específico del
frontend:

- `src/app/` — punto de entrada de la app y configuración de rutas.
- `src/providers/` — `AppThemeProvider` (Fluent + dark/light) y
  `AuthProvider` (manejo de sesión + 2FA en el cliente).
- `src/components/layout/` — layouts, headers, footers, theme toggle.
- `src/components/common/` — `EmptyState`, `LoadingState`, `ErrorState`,
  `ConfirmDialog`, `StatusBadge`, `SectionCard`.
- `src/components/appointments/` — pasos del wizard de reserva.
- `src/pages/public/` — `HomePage`, `BookAppointmentPage`,
  `AppointmentLookupPage`, `RequirementsPage`.
- `src/pages/admin/` — `AdminDashboardPage`, `AdminTributeTypesPage`,
  `AdminAvailabilityPage`, `AdminAppointmentsPage`, `AdminLocationsPage`,
  `AdminSettingsPage`.
- `src/pages/auth/AdminLoginPage.tsx` — login + 2FA.
- `src/services/` — `apiClient` (axios con `withCredentials`),
  `queryClient` (TanStack Query), `publicApi`, `adminApi`.
- `src/theme/` — `fluentTheme` (brand tokens), `useColorMode` (hook),
  `iconMap` (mapeo `icon_key` → componente de Fluent Icons).

## Sistema de UI

- La interfaz utiliza Fluent UI 2 para componentes interactivos y tokens de diseño.
- `src/styles/global.css` define solo utilidades internas mínimas del proyecto
  (`af-container`, `af-stack`, `af-card`, `af-hero`, etc.) para complementar
  Fluent UI.

## Iconos

Los iconos se mapean por clave (`icon_key` en backend → componente en
`@fluentui/react-icons`) en `src/theme/iconMap.tsx`. Si una clave no
existe, se usa `DocumentBulletList24Regular` como fallback.
