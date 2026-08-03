import {
  Button,
  Caption1,
  Title3,
} from '@fluentui/react-components';
import { Calculator24Regular } from '@fluentui/react-icons';
import { Link, NavLink } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export function PublicHeader() {
  const systemName = 'Sistema de Agenda – Plan 2026';

  const navItems = [
    { to: '/', label: 'Inicio' },
    { to: '/agendar', label: 'Reservar turno' },
    { to: '/consultar', label: 'Consultar reserva' },
    { to: '/requisitos', label: 'Requisitos' },
    { to: '/simulador', label: 'Simulador' },
    { to: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
  ];

  return (
    <header
      className="af-no-print"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--af-header-bg)',
        backdropFilter: 'saturate(180%) blur(16px)',
        WebkitBackdropFilter: 'saturate(180%) blur(16px)',
        borderBottom: '1px solid var(--af-border)',
      }}
    >
      <div
        className="af-container public-header-content"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 64,
          padding: '8px 0',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textDecoration: 'none',
            color: 'var(--af-text)',
          }}
        >
          <img
            src="/Logo.webp"
            alt="Intendencia de Lavalleja"
            style={{
              width: 48,
              height: 48,
              objectFit: 'contain',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, lineHeight: 1.15 }}>
            <Title3 style={{ margin: 0 }}>{systemName}</Title3>
            <Caption1 className="af-muted" style={{ marginTop: -2 }}>
              Intendencia de Lavalleja
            </Caption1>
          </div>
        </Link>

        <nav
          className="af-row public-primary-nav"
          style={{ gap: 4 }}
          aria-label="Navegación principal"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                padding: '8px 12px',
                borderRadius: 8,
                color: isActive ? 'var(--af-primary)' : 'var(--af-text)',
                background: isActive ? 'var(--af-brand-soft)' : 'transparent',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 14,
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="af-row" style={{ gap: 8 }}>
          <ThemeToggle />
          <Link to="/simulador" style={{ textDecoration: 'none' }}>
            <Button appearance="subtle" icon={<Calculator24Regular />}>
              Simulador
            </Button>
          </Link>
          <Link to="/agendar" style={{ textDecoration: 'none' }}>
            <Button appearance="primary" size="small">
              Reservar turno
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
