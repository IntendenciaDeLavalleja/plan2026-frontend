import { Field, Select } from '@fluentui/react-components';
import { PERIODICITY_LABELS } from '../../config/amnistiaRules.js';

export function InstallmentSelector({ scenarios, selectedScenario, onSelect }) {
  const periodicities = [...new Set(scenarios.map((scenario) => scenario.periodicity))];
  const selectedPeriodicity = selectedScenario.periodicity;
  const countOptions = scenarios.filter((scenario) => scenario.periodicity === selectedPeriodicity);

  function updatePeriodicity(periodicity) {
    const replacement = scenarios.find(
      (scenario) => scenario.periodicity === periodicity
        && scenario.requestedInstallmentCount === selectedScenario.requestedInstallmentCount,
    ) ?? scenarios.find((scenario) => scenario.periodicity === periodicity);
    if (replacement) onSelect(replacement);
  }

  function updateCount(count) {
    const replacement = scenarios.find(
      (scenario) => scenario.periodicity === selectedPeriodicity && scenario.requestedInstallmentCount === Number(count),
    );
    if (replacement) onSelect(replacement);
  }

  return (
    <div className="simulator-selector-grid">
      {periodicities.length > 1 && (
        <Field label="Periodicidad">
          <Select
            value={selectedPeriodicity}
            onChange={(event) => updatePeriodicity(event.target.value)}
            aria-label="Periodicidad de cuotas"
          >
            {periodicities.map((periodicity) => (
              <option key={periodicity} value={periodicity}>
                {PERIODICITY_LABELS[periodicity]}
              </option>
            ))}
          </Select>
        </Field>
      )}
      <Field label="Cantidad de cuotas">
        <Select
          value={String(selectedScenario.requestedInstallmentCount)}
          onChange={(event) => updateCount(event.target.value)}
          aria-label="Cantidad de cuotas"
        >
          {countOptions.map((scenario) => (
            <option key={scenario.id} value={String(scenario.requestedInstallmentCount)}>
              {scenario.requestedInstallmentCount} {PERIODICITY_LABELS[scenario.periodicity].toLowerCase()}
            </option>
          ))}
        </Select>
      </Field>
    </div>
  );
}
