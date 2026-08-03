import { Badge, Card, CardHeader, Divider, MessageBar, MessageBarBody, Text, Title3 } from '@fluentui/react-components';
import { Calculator24Regular } from '@fluentui/react-icons';
import { Link } from 'react-router-dom';
import { AMNISTIA_RULES, PERIODICITY_LABELS } from '../../config/amnistiaRules.js';
import { formatUyCurrency } from '../../lib/currency.js';
import { formatSimulationDate, SIMULATION_RESULT_NOTICE } from '../../lib/simulationMetadata.js';
import { summarizeInstallments } from './InstallmentSchedule.jsx';

function percentFromBps(bps) {
  return `${bps / 100}%`;
}

function Detail({ label, value }) {
  return (
    <div className="simulator-summary-detail">
      <Text className="af-muted">{label}</Text>
      <Text weight="semibold">{value}</Text>
    </div>
  );
}

export function ResultSummary({ scenario, regime, simulationDate }) {
  if (!scenario) return null;

  const regimeLabel = AMNISTIA_RULES.regimes[regime].label;
  const financed = scenario.financedBalanceCents > 0n;

  return (
    <Card className="simulator-summary-card" aria-labelledby="simulator-result-title">
      <CardHeader
        image={
          <div className="simulator-summary-icon" aria-hidden="true">
            <Calculator24Regular />
          </div>
        }
        header={<Title3 id="simulator-result-title">Resumen de la alternativa</Title3>}
        description={<Text className="af-muted">La quita se aplica exclusivamente sobre multas y recargos. La deuda tributaria principal no recibe descuento.</Text>}
        action={<Badge className="simulator-regime-badge" color="informative">{regimeLabel}</Badge>}
      />
      <Divider />
      <MessageBar intent="info">
        <MessageBarBody>{SIMULATION_RESULT_NOTICE} <Link to="/preguntas-frecuentes#resultado-estimado">Más información sobre el resultado estimado.</Link></MessageBarBody>
      </MessageBar>
      <div className="simulator-summary-grid">
        <Detail label="Deuda tributaria principal" value={formatUyCurrency(scenario.principalDebtCents)} />
        <Detail label="Multas" value={formatUyCurrency(scenario.finesCents)} />
        <Detail label="Recargos" value={formatUyCurrency(scenario.surchargesCents)} />
        <Detail label="Total original" value={formatUyCurrency(scenario.originalDebtCents)} />
        <Detail label="Base bonificable: multas + recargos" value={formatUyCurrency(scenario.discountableAmountCents)} />
        <Detail label="Modalidad" value={scenario.modalityLabel} />
        <Detail label="Porcentaje de quita" value={percentFromBps(scenario.discountBps)} />
        <Detail label="Importe de la quita" value={formatUyCurrency(scenario.discountCents)} />
        <Detail label="Multas y recargos después de la quita" value={formatUyCurrency(scenario.remainingFinesAndSurchargesCents)} />
        <Detail label="Total regularizado" value={formatUyCurrency(scenario.regularizedTotalCents)} />
        <Detail label="Fecha de la simulación" value={formatSimulationDate(simulationDate)} />
        {scenario.periodicity === null ? (
          <Detail label="Total a pagar al contado" value={formatUyCurrency(scenario.regularizedTotalCents)} />
        ) : (
          <>
            <Detail label="Entrega inicial mínima" value={<Link to="/preguntas-frecuentes#calculo-entrega-inicial">{formatUyCurrency(scenario.minimumDownPaymentCents)}</Link>} />
            <Detail label="Saldo financiado" value={formatUyCurrency(scenario.financedBalanceCents)} />
          </>
        )}
        <Detail
          label="Plan"
          value={scenario.periodicity
            ? (financed ? `${scenario.installmentCount} cuotas ${PERIODICITY_LABELS[scenario.periodicity].toLowerCase()}` : 'Sin saldo financiable')
            : 'Pago único'}
        />
      </div>
      {scenario.periodicity !== null && scenario.minimumDownPaymentCents > 0n && (
        <Text className="af-muted" size={200}>Corresponde al 30% del total regularizado después de la quita.</Text>
      )}
      {financed && (
        <div className="simulator-installment-summary">
          <Text weight="semibold">Resumen de cuotas</Text>
          <Text>{summarizeInstallments(scenario.installments)}</Text>
        </div>
      )}
      <Detail label="Ahorro obtenido" value={formatUyCurrency(scenario.savingsCents)} />
    </Card>
  );
}
