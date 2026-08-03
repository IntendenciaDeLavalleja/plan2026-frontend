import { Card, CardHeader, Divider, Text, Title3 } from '@fluentui/react-components';
import { Info24Regular } from '@fluentui/react-icons';

const CONDITIONS = [
  'El plazo para ampararse al régimen es de 180 días corridos contados desde el día siguiente a la promulgación.',
  'Sin intereses.',
  'Se conviene un único padrón por convenio.',
  'No se incluyen padrones bloqueados.',
  'Están comprendidas todas las deudas vencidas a la fecha de realización inclusive.',
  'Se conviene la totalidad de la deuda vencida.',
  'El convenio debe suscribirse el mismo día en que se realiza el pago parcial.',
  'La primera cuota vence a los 30 días de la suscripción. La caducidad aplicable depende de la modalidad de pago seleccionada.',
  'El saldo financiado se convierte a Unidades Indexadas al momento de la suscripción.',
  'El incumplimiento también puede dar lugar a la comunicación a bases de información crediticia y al inicio de las acciones judiciales correspondientes.',
];

export function ConditionsNotice() {
  return (
    <Card className="simulator-conditions-card">
      <CardHeader
        image={<Info24Regular />}
        header={<Title3>Condiciones generales</Title3>}
      />
      <Divider />
      <ul className="simulator-conditions-list">
        {CONDITIONS.map((condition) => (
          <li key={condition}><Text>{condition}</Text></li>
        ))}
      </ul>
    </Card>
  );
}
