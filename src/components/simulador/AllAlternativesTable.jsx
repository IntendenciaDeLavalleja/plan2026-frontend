import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@fluentui/react-components';
import { PERIODICITY_LABELS } from '../../config/amnistiaRules.js';
import { formatUyCurrency } from '../../lib/currency.js';
import { summarizeInstallments } from './InstallmentSchedule.jsx';

export function AllAlternativesTable({ scenarios, onSelect }) {
  return (
    <div className="simulator-table-scroll">
      <Table size="small" aria-label="Todas las alternativas de financiación">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Pago</TableHeaderCell>
            <TableHeaderCell>Entrega inicial</TableHeaderCell>
            <TableHeaderCell>Saldo</TableHeaderCell>
            <TableHeaderCell>Cuotas</TableHeaderCell>
            <TableHeaderCell>Acción</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scenarios.map((scenario) => (
            <TableRow key={scenario.id}>
              <TableCell>
                {scenario.periodicity ? (
                  <Badge appearance="outline">{PERIODICITY_LABELS[scenario.periodicity]}</Badge>
                ) : (
                  'Pago único'
                )}
              </TableCell>
              <TableCell>{scenario.periodicity !== null ? formatUyCurrency(scenario.minimumDownPaymentCents) : 'No corresponde'}</TableCell>
              <TableCell>{scenario.financedBalanceCents > 0n ? formatUyCurrency(scenario.financedBalanceCents) : 'No corresponde'}</TableCell>
              <TableCell>{scenario.periodicity && scenario.financedBalanceCents === 0n ? 'Sin saldo financiable' : summarizeInstallments(scenario.installments)}</TableCell>
              <TableCell>
                <Button appearance="subtle" size="small" onClick={() => onSelect(scenario)}>
                  Seleccionar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
