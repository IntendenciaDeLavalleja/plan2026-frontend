import { Field, Input } from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';

export function FaqSearch({ value, onChange }) {
  return (
    <Field label="Buscar una pregunta" className="faq-search-field">
      <Input
        value={value}
        onChange={(_, data) => onChange(data.value)}
        contentBefore={<Search24Regular aria-hidden="true" />}
        placeholder="Por ejemplo: cuotas, vivienda propia, multas o recargos"
        aria-label="Buscar una pregunta"
        size="large"
      />
    </Field>
  );
}
