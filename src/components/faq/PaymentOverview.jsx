import { Badge, Card, Text, Title3 } from '@fluentui/react-components';
import { Home24Regular, Payment24Regular } from '@fluentui/react-icons';

export function PaymentOverview({ options, housingOption }) {
  return (
    <section className="faq-payment-overview" aria-labelledby="payment-overview-title">
      <div className="af-text-block">
        <Title3 id="payment-overview-title">Opciones de pago, de un vistazo</Title3>
        <Text className="af-muted">Estas opciones son informativas. La quita se aplica sobre multas y recargos, no sobre la deuda principal.</Text>
      </div>
      <div className="faq-payment-grid">
        {options.map((option) => (
          <Card key={option.id} className="faq-payment-card">
            <Payment24Regular aria-hidden="true" />
            <Text weight="semibold">{option.title}</Text>
            <Badge className="faq-payment-discount" color="brand">{option.discount}</Badge>
            <Text className="af-muted">{option.detail}</Text>
          </Card>
        ))}
      </div>
      <Card className="faq-housing-card">
        <Home24Regular aria-hidden="true" />
        <div className="af-text-block-tight">
          <Text weight="semibold">{housingOption.title}</Text>
          <Badge className="faq-payment-discount" color="informative">{housingOption.discount}</Badge>
          <Text className="af-muted">{housingOption.detail}</Text>
        </div>
      </Card>
    </section>
  );
}
