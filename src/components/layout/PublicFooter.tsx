import {
  Body1,
  Caption1,
  Link as FluentLink,
  Subtitle2,
} from '@fluentui/react-components';
import { Mail24Regular, Phone24Regular } from '@fluentui/react-icons';
import { AGENDA_CONFIG } from '@/config/agendaConfig';

export function PublicFooter() {
  return (
    <footer
      className="af-no-print"
      style={{
        marginTop: 64,
        background: 'var(--af-footer-gradient)',
        color: '#cbd5e1',
        padding: '44px 0 24px',
      }}
    >
      <div className="af-container af-stack-lg">
        <div
          className="af-row"
          style={{ alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}
        >
          <div className="af-stack" style={{ gap: 14, maxWidth: 420 }}>
            <div className="af-row" style={{ gap: 12 }}>
              <img
                src="/Logo.webp"
                alt="Intendencia de Lavalleja"
                style={{
                  width: 48,
                  height: 48,
                  objectFit: 'contain',
                }}
              />
              <Subtitle2 style={{ color: '#fff' }}>Plan 2026</Subtitle2>
            </div>
            <Body1 style={{ color: '#dbe4f0', maxWidth: 360 }}>
              Plataforma oficial de agenda electrónica para el Plan 2026.
              Reservá tu turno para regularizar adeudos, convenios y tributos departamentales.
            </Body1>
          </div>
          <div className="af-stack" style={{ gap: 8, minWidth: 220 }}>
            <Subtitle2 style={{ color: '#fff' }}>Accesos rápidos</Subtitle2>
            <FluentLink href="/agendar" appearance="subtle" style={{ color: '#eff6ff' }}>
              Reservar turno
            </FluentLink>
            <FluentLink href="/consultar" appearance="subtle" style={{ color: '#eff6ff' }}>
              Consultar reserva
            </FluentLink>
            <FluentLink href="/requisitos" appearance="subtle" style={{ color: '#eff6ff' }}>
              Requisitos generales
            </FluentLink>
            <div className="af-stack" style={{ gap: 6, marginTop: 8 }}>
              <Subtitle2 style={{ color: '#fff' }}>Contacto</Subtitle2>
              <div className="af-row" style={{ gap: 8 }}>
                <Phone24Regular />
                <span>{AGENDA_CONFIG.contactPhone}</span>
              </div>
              <div className="af-row" style={{ gap: 8 }}>
                <Mail24Regular />
                <span>agenda@lavalleja.gub.uy</span>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 16,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Caption1 style={{ color: '#94a3b8' }}>
            © {new Date().getFullYear()} Intendencia de Lavalleja · Todos los derechos reservados.
          </Caption1>
          <Caption1 style={{ color: '#94a3b8' }}>
            Gobierno Departamental de Lavalleja · República Oriental del Uruguay
          </Caption1>
        </div>
      </div>
    </footer>
  );
}
