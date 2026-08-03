import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Body1,
  Caption1,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
} from '@fluentui/react-components';
import { PERIODICITY_LABELS } from '../../config/amnistiaRules.js';
import { formatUyCurrency } from '../../lib/currency.js';

// eslint-disable-next-line react-refresh/only-export-components
export function summarizeInstallments(installments) {
  if (installments.length === 0) return 'Pago único';

  const groups = [];
  for (const installment of installments) {
    const group = groups.find((item) => item.cents === installment);
    if (group) group.count += 1;
    else groups.push({ cents: installment, count: 1 });
  }

  return groups
    .map((group) => `${group.count} ${group.count === 1 ? 'cuota' : 'cuotas'} de ${formatUyCurrency(group.cents)}`)
    .join(' y ');
}

export function InstallmentSchedule({ scenario }) {
  if (scenario.installments.length === 0) {
    return <Body1>La entrega mínima cubre la totalidad del importe regularizado. No queda saldo para financiar.</Body1>;
  }

  return (
    <div className="af-stack" style={{ gap: 10 }}>
      <Text weight="semibold">{summarizeInstallments(scenario.installments)}</Text>
      <Caption1 className="af-muted">
        {PERIODICITY_LABELS[scenario.periodicity]}. Los importes en pesos son estimados y pueden variar según el valor de la UI.
      </Caption1>
      <Accordion collapsible>
        <AccordionItem value="schedule">
          <AccordionHeader>Ver detalle de cuotas</AccordionHeader>
          <AccordionPanel>
            <div className="simulator-table-scroll">
              <Table size="small" aria-label="Detalle de cuotas">
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Número de cuota</TableHeaderCell>
                    <TableHeaderCell>Periodicidad</TableHeaderCell>
                    <TableHeaderCell>Importe</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scenario.installments.map((installment, index) => (
                    <TableRow key={`${scenario.id}-${index}`}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{PERIODICITY_LABELS[scenario.periodicity]}</TableCell>
                      <TableCell>{formatUyCurrency(installment)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
