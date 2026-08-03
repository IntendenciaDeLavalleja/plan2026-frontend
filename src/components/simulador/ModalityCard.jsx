import { Badge, Button, Card, CardHeader, Divider, MessageBar, MessageBarBody, Text } from '@fluentui/react-components';
import { ChevronDown24Regular, ChevronUp24Regular, Play24Regular } from '@fluentui/react-icons';
import { Link } from 'react-router-dom';
import { AMNISTIA_RULES } from '../../config/amnistiaRules.js';
import { formatUyCurrency } from '../../lib/currency.js';
import { AllAlternativesTable } from './AllAlternativesTable.jsx';
import { InstallmentSchedule } from './InstallmentSchedule.jsx';
import { InstallmentSelector } from './InstallmentSelector.jsx';

function percentFromBps(bps) {
  return `${bps / 100}%`;
}

export function ModalityCard({
  regime,
  modalityKey,
  scenarios,
  selectedScenario,
  isActive,
  isExpanded,
  onActivate,
  onSelectScenario,
  onToggleAlternatives,
}) {
  const rule = AMNISTIA_RULES.regimes.general.modalities[modalityKey];
  const discountBps = regime === 'singleProperty'
    ? AMNISTIA_RULES.regimes.singleProperty.overrideDiscountBps
    : rule.discountBps;
  const hasFinancing = selectedScenario.periodicity !== null;
  const hasFinancedBalance = selectedScenario.financedBalanceCents > 0n;
  const expirationNotice = modalityKey === 'partialTwo'
    ? 'La primera cuota vence a los 30 días de la suscripción. El incumplimiento de un pago produce el cese de pleno derecho del convenio.'
    : selectedScenario.periodicity === 'quarterly'
      ? 'La primera cuota vence a los 30 días de la suscripción. El incumplimiento de 2 cuotas trimestrales consecutivas produce el cese de pleno derecho del convenio.'
      : 'La primera cuota vence a los 30 días de la suscripción. El incumplimiento de 4 cuotas mensuales consecutivas produce el cese de pleno derecho del convenio.';

  return (
    <Card
      className={`simulator-modality-card${isActive ? ' simulator-modality-card-active' : ''}`}
    >
      <CardHeader
        header={<Text weight="semibold" size={400}>{rule.label}</Text>}
        description={<Text className="af-muted">{scenarios.length} alternativa{scenarios.length === 1 ? '' : 's'}</Text>}
        action={<Badge className="simulator-discount-badge" color="brand">Quita {percentFromBps(discountBps)}</Badge>}
      />
      <Divider />
      <div className="af-stack" style={{ padding: 16, gap: 12 }}>
        <div className="simulator-card-money-grid">
          <div>
            <Text className="af-muted">Quita</Text>
            <Text weight="semibold">{formatUyCurrency(selectedScenario.discountCents)}</Text>
          </div>
          <div>
            <Text className="af-muted">Total regularizado</Text>
            <Text weight="semibold">{formatUyCurrency(selectedScenario.regularizedTotalCents)}</Text>
          </div>
        </div>

        {hasFinancing && (
          <div className="simulator-card-money-grid">
            <div>
              <Text className="af-muted"><Link to="/preguntas-frecuentes#calculo-entrega-inicial">Entrega inicial mínima</Link></Text>
              <Text weight="semibold">{formatUyCurrency(selectedScenario.minimumDownPaymentCents)}</Text>
              {selectedScenario.minimumDownPaymentCents > 0n && <Text size={200} className="af-muted">30% del total regularizado después de la quita.</Text>}
            </div>
            <div>
              <Text className="af-muted">Saldo financiado</Text>
              <Text weight="semibold">{formatUyCurrency(selectedScenario.financedBalanceCents)}</Text>
            </div>
          </div>
        )}

        {hasFinancing ? (
          <>
            <InstallmentSelector
              scenarios={scenarios}
              selectedScenario={selectedScenario}
              onSelect={(scenario) => {
                onActivate(modalityKey);
                onSelectScenario(scenario);
              }}
            />
            <InstallmentSchedule scenario={selectedScenario} />
            {hasFinancedBalance && (
              <MessageBar intent="info">
                <MessageBarBody>
                  El saldo financiado será convertido a Unidades Indexadas al momento de suscribir el convenio. Los importes de las cuotas expresados en pesos son una estimación y pueden variar según el valor de la UI.
                  {' '}<Link to="/preguntas-frecuentes#unidades-indexadas">¿Qué significa esto?</Link>
                </MessageBarBody>
              </MessageBar>
            )}
            <MessageBar intent="warning"><MessageBarBody>{expirationNotice}</MessageBarBody></MessageBar>
          </>
        ) : (
          <Text>Total a pagar al contado: {formatUyCurrency(selectedScenario.regularizedTotalCents)}.</Text>
        )}

        <Button
          appearance="outline"
          icon={<Play24Regular />}
          onClick={() => onActivate(modalityKey)}
        >
          Ver en resumen
        </Button>

        <Button
          appearance="subtle"
          icon={isExpanded ? <ChevronUp24Regular /> : <ChevronDown24Regular />}
          onClick={(event) => {
            event.stopPropagation();
            onToggleAlternatives();
          }}
        >
          Ver todas las alternativas
        </Button>
        {isExpanded && (
          <AllAlternativesTable
            scenarios={scenarios}
            onSelect={(scenario) => {
              onActivate(modalityKey);
              onSelectScenario(scenario);
            }}
          />
        )}
      </div>
    </Card>
  );
}
