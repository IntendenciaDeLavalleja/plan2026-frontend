import { Button, Field, Input, MessageBar, MessageBarBody, Text, Title3 } from '@fluentui/react-components';
import { Calculator24Regular, Delete24Regular, Play24Regular } from '@fluentui/react-icons';
import { Link } from 'react-router-dom';
import { formatUyCurrency } from '../../lib/currency.js';
import { SIMULATION_DATE_NOTICE } from '../../lib/simulationMetadata.js';

const FIELDS = [
  {
    key: 'principalDebt',
    label: 'Deuda tributaria principal',
    help: 'Importe adeudado por Contribución Inmobiliaria y demás tributos que se cobran conjuntamente, sin incluir multas ni recargos.',
  },
  { key: 'fines', label: 'Multas', help: 'Total de multas generadas por la deuda.' },
  { key: 'surcharges', label: 'Recargos', help: 'Total de recargos generados por la deuda.' },
];

export function DebtInputs({
  values,
  errors,
  preview,
  formMessage,
  principalDebtInputRef,
  onChange,
  onCalculate,
  onClear,
  onLoadExample,
}) {
  return (
    <section className="simulator-input-card" aria-labelledby="simulator-input-title">
      <div className="af-text-block">
        <Title3 id="simulator-input-title">Detalle de la deuda</Title3>
        <Text className="af-muted">
          La quita se aplica exclusivamente sobre multas y recargos. La deuda tributaria principal no recibe descuento. {' '}
          <Link to="/preguntas-frecuentes#diferencia-deuda-multas-recargos">Conocé la diferencia entre estos importes.</Link>
        </Text>
      </div>

      <form
        className="af-stack"
        style={{ marginTop: 20 }}
        onSubmit={(event) => {
          event.preventDefault();
          onCalculate();
        }}
        noValidate
      >
        {FIELDS.map((field) => (
          <Field
            key={field.key}
            label={field.label}
            hint={field.help}
            validationState={errors[field.key] ? 'error' : undefined}
            validationMessage={errors[field.key]}
            required={false}
          >
            <Input
              ref={field.key === 'principalDebt' ? principalDebtInputRef : undefined}
              value={values[field.key]}
              onChange={(_, data) => onChange(field.key, data.value)}
              contentBefore="$"
              placeholder="0,00"
              inputMode="decimal"
              autoComplete="off"
              aria-label={field.label}
              size="large"
            />
          </Field>
        ))}

        <div className="simulator-total-preview" aria-label="Resumen de deuda ingresada">
          <Text weight="semibold">Total original</Text>
          <Text size={500} weight="bold">
            {preview === null ? '$ 0,00' : formatUyCurrency(preview.originalDebtCents)}
          </Text>
          <Text className="af-muted">Base bonificable: multas + recargos {preview === null ? '$ 0,00' : formatUyCurrency(preview.discountableAmountCents)}</Text>
        </div>

        <MessageBar intent="warning">
          <MessageBarBody style={{ whiteSpace: 'pre-line' }}>{SIMULATION_DATE_NOTICE}</MessageBarBody>
        </MessageBar>

        {formMessage && (
          <MessageBar intent="error">
            <MessageBarBody>{formMessage}</MessageBarBody>
          </MessageBar>
        )}

        <div className="simulator-form-actions">
          <Button appearance="primary" type="submit" icon={<Calculator24Regular />} size="large">
            Calcular
          </Button>
          <Button appearance="secondary" type="button" icon={<Delete24Regular />} onClick={onClear}>
            Limpiar
          </Button>
          <Button appearance="subtle" type="button" icon={<Play24Regular />} onClick={onLoadExample}>
            Cargar ejemplo
          </Button>
        </div>
      </form>
    </section>
  );
}
