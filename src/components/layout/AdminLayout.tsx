import {
  Avatar,
  Button,
  Caption1,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
} from '@fluentui/react-components';
import {
  Call24Regular,
  CalendarMonth24Regular,
  ChevronDown24Regular,
  Clock24Regular,
  Home24Regular,
  Location24Regular,
  Settings24Regular,
  SignOut24Regular,
  Tag24Regular,
} from '@fluentui/react-icons';
import { type ReactNode, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { ThemeToggle } from './ThemeToggle';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin', label: 'Panel', icon: <Home24Regular />, end: true },
  { to: '/admin/tributos', label: 'Tributos', icon: <Tag24Regular /> },
  { to: '/admin/disponibilidad', label: 'Disponibilidad', icon: <Clock24Regular /> },
  { to: '/admin/turnos', label: 'Turnos', icon: <CalendarMonth24Regular /> },
  { to: '/admin/registrar-turno', label: 'Registrar por teléfono', icon: <Call24Regular /> },
  { to: '/admin/sedes', label: 'Sedes', icon: <Location24Regular /> },
  { to: '/admin/configuracion', label: 'Configuración', icon: <Settings24Regular /> },
];

interface Props {
  pageTitle: string;
  pageSubtitle?: string;
  topActions?: ReactNode;
  children: ReactNode;
}

export function AdminLayout({ pageTitle, pageSubtitle, topActions, children }: Props) {
  const { user, logout } = useAuth();
  const [navOpen, setNavOpen] = useState(true);

  return (
    <div
      className="af-page"
      style={{
        gridTemplateColumns: navOpen ? '260px 1fr' : '72px 1fr',
        display: 'grid',
        gridTemplateAreas: '"sidebar main"',
      }}
    >
      <aside
        className="af-no-print"
        style={{
          gridArea: 'sidebar',
          background: 'var(--af-surface)',
          borderRight: '1px solid var(--af-border)',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          minHeight: '100vh',
          position: 'sticky',
          top: 0,
        }}
      >
        <div className="af-row" style={{ gap: 12, alignItems: 'center' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'var(--af-brand-gradient)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
            }}
            aria-hidden
          >
            IDL
          </div>
          {navOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, lineHeight: 1.15 }}>
              <Text weight="semibold" size={400}>
                Panel administrativo
              </Text>
              <Caption1 className="af-muted">Sistema de Agenda – Plan 2026</Caption1>
            </div>
          )}
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }} aria-label="Menú principal">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 10,
                textDecoration: 'none',
                color: isActive ? 'var(--af-primary)' : 'var(--af-text)',
                background: isActive ? 'var(--af-brand-soft)' : 'transparent',
                fontWeight: 600,
                fontSize: 14,
              })}
            >
              {item.icon}
              {navOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto' }} className="af-row">
          <Button
            appearance="subtle"
            onClick={() => setNavOpen((v) => !v)}
            aria-label="Colapsar navegación"
          >
            {navOpen ? '<<' : '>>'}
          </Button>
        </div>
      </aside>
      <main
        style={{
          gridArea: 'main',
          minWidth: 0,
          background: 'var(--af-bg)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <header
          className="af-no-print"
          style={{
            background: 'var(--af-surface)',
            borderBottom: '1px solid var(--af-border)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Text size={500} weight="bold" as="h1" style={{ display: 'block', margin: 0 }}>
                {pageTitle}
              </Text>
            </div>
            {pageSubtitle && (
              <Caption1 className="af-muted">{pageSubtitle}</Caption1>
            )}
          </div>
          {topActions}
          <ThemeToggle />
          {user && (
            <Menu>
              <MenuTrigger>
                <Button
                  appearance="subtle"
                  icon={<Avatar name={user.full_name || user.username} size={24} />}
                  iconPosition="before"
                >
                  {user.full_name || user.username}
                  <ChevronDown24Regular />
                </Button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem icon={<SignOut24Regular />} onClick={() => logout()}>
                    Cerrar sesión
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          )}
        </header>
        <div style={{ flex: 1, padding: 24, overflow: 'auto' }}>{children}</div>
      </main>
    </div>
  );
}
