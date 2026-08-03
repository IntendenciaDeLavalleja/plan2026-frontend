import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  MessageBar,
  MessageBarBody,
  Tab,
  TabList,
  Text,
  Title1,
} from '@fluentui/react-components';
import {
  ArrowLeft24Regular,
  ArrowDownload24Regular,
  Calculator24Regular,
  Info24Regular,
  Open24Regular,
} from '@fluentui/react-icons';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout.tsx';
import { DebtInputs } from '../components/simulador/DebtInputs.jsx';
import { ResultSummary } from '../components/simulador/ResultSummary.jsx';
import { ModalityCard } from '../components/simulador/ModalityCard.jsx';
import { ConditionsNotice } from '../components/simulador/ConditionsNotice.jsx';
import { AMNISTIA_RULES } from '../config/amnistiaRules.js';
import { OFFICIAL_DEBT_QUERY_URL } from '../config/simulatorTutorialContent.js';
import { parseUyCurrency } from '../lib/currency.js';
import { createSimulationSnapshot } from '../lib/simulationMetadata.js';
import {
  generateGeneralScenarios,
  generateSinglePropertyScenarios,
  sumDiscountableConcepts,
  sumOriginalDebt,
} from '../lib/amnistiaCalculator.js';
import calculatorFileUrl from '../../data/Calculadora Amnistia Lavalleja 2026.xlsx?url';

const EMPTY_VALUES = Object.freeze({
  principalDebt: '',
  fines: '',
  surcharges: '',
});

const EXAMPLE_VALUES = Object.freeze({
  principalDebt: '100.000,00',
  fines: '20.000,00',
  surcharges: '30.000,00',
});

const DEBT_INPUTS = Object.freeze([
  ['principalDebt', 'principalDebtCents'],
  ['fines', 'finesCents'],
  ['surcharges', 'surchargesCents'],
]);

const INITIAL_PLAN_SELECTIONS = Object.freeze({
  general: {
    cash: { periodicity: null, installmentCount: 0 },
    partialTwo: { periodicity: 'monthly', installmentCount: 2 },
    partialThirtySix: { periodicity: 'monthly', installmentCount: 36 },
    financedThirtySix: { periodicity: 'monthly', installmentCount: 36 },
  },
  singleProperty: {
    cash: { periodicity: null, installmentCount: 0 },
    partialTwo: { periodicity: 'monthly', installmentCount: 2 },
    partialThirtySix: { periodicity: 'monthly', installmentCount: 36 },
    financedThirtySix: { periodicity: 'monthly', installmentCount: 36 },
  },
});

const INITIAL_ACTIVE_MODALITIES = Object.freeze({
  general: 'cash',
  singleProperty: 'cash',
});

function cloneInitialPlanSelections() {
  return {
    general: { ...INITIAL_PLAN_SELECTIONS.general },
    singleProperty: { ...INITIAL_PLAN_SELECTIONS.singleProperty },
  };
}

function parseDebtValues(values) {
  const parsed = {};
  const errors = {};

  for (const [field, centsField] of DEBT_INPUTS) {
    try {
      parsed[centsField] = parseUyCurrency(values[field]);
    } catch {
      errors[field] = 'Ingresá un importe válido, sin negativos y con hasta dos decimales.';
    }
  }

  return { parsed, errors };
}

function scenarioForSelection(scenarios, selection) {
  if (selection.periodicity === null) {
    return scenarios.find((scenario) => scenario.periodicity === null) ?? scenarios[0];
  }
  return scenarios.find(
    (scenario) => scenario.periodicity === selection.periodicity
      && scenario.requestedInstallmentCount === selection.installmentCount,
  ) ?? scenarios[0];
}

export function SimuladorPage() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState('');
  const [snapshot, setSnapshot] = useState(null);
  const [activeRegime, setActiveRegime] = useState('general');
  const [activeModalities, setActiveModalities] = useState(INITIAL_ACTIVE_MODALITIES);
  const [planSelections, setPlanSelections] = useState(cloneInitialPlanSelections);
  const [expandedAlternatives, setExpandedAlternatives] = useState({});
  const principalDebtInputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    document.title = 'Simulador de quita | Intendencia de Lavalleja';
    return () => {
      document.title = 'Amnistía Financiera · Intendencia de Lavalleja';
    };
  }, []);

  const preview = useMemo(() => {
    const parsedResult = parseDebtValues(values);
    if (Object.keys(parsedResult.errors).length > 0) return null;
    return {
      originalDebtCents: sumOriginalDebt(parsedResult.parsed),
      discountableAmountCents: sumDiscountableConcepts(parsedResult.parsed),
    };
  }, [values]);

  const generated = useMemo(() => {
    if (!snapshot) return { general: [], singleProperty: [], error: false };
    try {
      return {
        general: generateGeneralScenarios(snapshot.debt),
        singleProperty: generateSinglePropertyScenarios(snapshot.debt),
        error: false,
      };
    } catch {
      return { general: [], singleProperty: [], error: true };
    }
  }, [snapshot]);

  const scenariosByModality = useMemo(() => {
    const selectedScenarios = generated[activeRegime];
    return Object.keys(AMNISTIA_RULES.regimes.general.modalities).reduce((grouped, modalityKey) => {
      grouped[modalityKey] = selectedScenarios.filter((scenario) => scenario.modality === modalityKey);
      return grouped;
    }, {});
  }, [activeRegime, generated]);

  const activeModality = activeModalities[activeRegime];
  const selectedSummaryScenario = useMemo(() => {
    const scenarios = scenariosByModality[activeModality] ?? [];
    return scenarioForSelection(scenarios, planSelections[activeRegime][activeModality]);
  }, [activeModality, activeRegime, planSelections, scenariosByModality]);

  function updateValue(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormMessage('');
  }

  function calculate() {
    const parsedResult = parseDebtValues(values);
    const nextErrors = parsedResult.errors;
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormMessage('Revisá los importes ingresados antes de calcular.');
      return;
    }

    const totalCents = sumOriginalDebt(parsedResult.parsed);
    if (totalCents === 0n) {
      setErrors({});
      setFormMessage('Ingresá al menos un importe mayor a cero para realizar la simulación.');
      return;
    }

    setErrors({});
    setFormMessage('');
    setSnapshot(createSimulationSnapshot(parsedResult.parsed));
    window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      resultsRef.current?.focus({ preventScroll: true });
    });
  }

  function clear() {
    setValues(EMPTY_VALUES);
    setErrors({});
    setFormMessage('');
    setSnapshot(null);
    setActiveRegime('general');
    setActiveModalities(INITIAL_ACTIVE_MODALITIES);
    setPlanSelections(cloneInitialPlanSelections());
    setExpandedAlternatives({});
    window.requestAnimationFrame(() => principalDebtInputRef.current?.focus());
  }

  function loadExample() {
    setValues(EXAMPLE_VALUES);
    setErrors({});
    setFormMessage('');
  }

  function selectScenario(modalityKey, scenario) {
    setActiveModalities((current) => ({ ...current, [activeRegime]: modalityKey }));
    setPlanSelections((current) => ({
      ...current,
      [activeRegime]: {
        ...current[activeRegime],
        [modalityKey]: {
          periodicity: scenario.periodicity,
          installmentCount: scenario.requestedInstallmentCount,
        },
      },
    }));
  }

  return (
    <PublicLayout>
      <div className="simulator-page">
        <div className="af-container simulator-container">
          <header className="simulator-heading">
            <div className="af-text-block">
              <div className="simulator-eyebrow"><Calculator24Regular /> Simulador informativo</div>
              <Title1>Simulador de quita de deudas</Title1>
              <Text size={400} className="af-muted">
                Ingresá la deuda principal, las multas y los recargos para conocer las alternativas disponibles dentro del régimen de amnistía.
              </Text>
            </div>
            <div className="simulator-heading-actions">
              <Button
                as="a"
                appearance="primary"
                size="large"
                href={OFFICIAL_DEBT_QUERY_URL}
                target="_blank"
                rel="noopener noreferrer"
                icon={<Open24Regular />}
                iconPosition="after"
              >
                Consultar Deuda Acá
              </Button>
              <Button
                as="a"
                appearance="secondary"
                href={calculatorFileUrl}
                download="Calculadora Amnistia Lavalleja 2026.xlsx"
                icon={<ArrowDownload24Regular />}
              >
                Descargar calculadora Excel
              </Button>
              <Link to="/simulador" style={{ textDecoration: 'none' }}>
                <Button appearance="transparent" icon={<Info24Regular />}>Ver cómo funciona el simulador</Button>
              </Link>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Button appearance="secondary" icon={<ArrowLeft24Regular />}>Volver al inicio</Button>
              </Link>
            </div>
          </header>

          <MessageBar intent="info" className="simulator-information">
            <MessageBarBody>
              La simulación es informativa y está sujeta a la verificación definitiva de la deuda, las condiciones del padrón y la normativa vigente al momento de suscribir el convenio.
            </MessageBarBody>
          </MessageBar>

          <section className="simulator-faq-help" aria-labelledby="simulator-faq-help-title">
            <div className="af-text-block-tight">
              <Text id="simulator-faq-help-title" weight="semibold">¿No sabés qué significa cada importe?</Text>
              <Text className="af-muted">Consultá las preguntas frecuentes para entender la deuda principal, las multas, los recargos, las quitas y las opciones de financiación.</Text>
            </div>
            <Link to="/preguntas-frecuentes" style={{ textDecoration: 'none' }}>
              <Button appearance="secondary" icon={<Info24Regular />}>Ver preguntas frecuentes</Button>
            </Link>
          </section>

          <div className="simulator-layout">
            <DebtInputs
              values={values}
              errors={errors}
              preview={preview}
              formMessage={formMessage}
              principalDebtInputRef={principalDebtInputRef}
              onChange={updateValue}
              onCalculate={calculate}
              onClear={clear}
              onLoadExample={loadExample}
            />

            <section
              ref={resultsRef}
              tabIndex={-1}
              className="simulator-results"
              aria-label="Resultados de la simulación"
            >
              {!snapshot && (
                <div className="simulator-empty-result">
                  <Calculator24Regular aria-hidden="true" />
                  <Text weight="semibold">Los resultados se mostrarán aquí.</Text>
                  <Text className="af-muted">Completá los importes y presioná Calcular para comparar las alternativas de pago.</Text>
                </div>
              )}

              {generated.error && (
                <MessageBar intent="error">
                  <MessageBarBody>No fue posible completar la simulación. Revisá los importes ingresados.</MessageBarBody>
                </MessageBar>
              )}

              {snapshot && !generated.error && (
                <div className="af-stack-lg">
                  <div className="simulator-live-message" role="status" aria-live="polite">
                    Simulación actualizada. Se generaron 99 alternativas para el régimen general y 99 para vivienda propia.
                  </div>
                  <TabList
                    selectedValue={activeRegime}
                    onTabSelect={(_, data) => setActiveRegime(data.value)}
                    aria-label="Régimen de amnistía"
                  >
                    <Tab value="general">Régimen general</Tab>
                    <Tab value="singleProperty">Vivienda propia</Tab>
                  </TabList>

                  {activeRegime === 'singleProperty' && (
                    <MessageBar intent="warning">
                      <MessageBarBody>
                        La quita del 80% requiere acreditar que el inmueble se destina a la vivienda propia del contribuyente mediante declaración jurada y documentación pública. La solicitud será analizada por el Tribunal de Quitas y Esperas, que dispone de hasta 60 días para expedirse. Esta simulación no implica la aprobación del beneficio.
                        {' '}<Link to="/preguntas-frecuentes#vivienda-propia">Conocé cómo funciona el beneficio de vivienda propia.</Link>
                      </MessageBarBody>
                    </MessageBar>
                  )}

                  <ResultSummary
                    scenario={selectedSummaryScenario}
                    regime={activeRegime}
                    simulationDate={snapshot.simulationDate}
                  />

                  <div className="af-text-block">
                    <Text weight="semibold">Alternativas disponibles</Text>
                    <Text className="af-muted">
                      Seleccioná una estructura de pago para actualizar el resumen. No se aplican intereses en esta simulación.
                    </Text>
                  </div>

                  <div className="simulator-modalities-grid">
                    {Object.keys(AMNISTIA_RULES.regimes.general.modalities).map((modalityKey) => {
                      const scenarios = scenariosByModality[modalityKey];
                      const selectedScenario = scenarioForSelection(
                        scenarios,
                        planSelections[activeRegime][modalityKey],
                      );
                      const expansionKey = `${activeRegime}-${modalityKey}`;
                      return (
                        <ModalityCard
                          key={modalityKey}
                          regime={activeRegime}
                          modalityKey={modalityKey}
                          scenarios={scenarios}
                          selectedScenario={selectedScenario}
                          isActive={activeModality === modalityKey}
                          isExpanded={Boolean(expandedAlternatives[expansionKey])}
                          onActivate={(key) => setActiveModalities((current) => ({ ...current, [activeRegime]: key }))}
                          onSelectScenario={(scenario) => selectScenario(modalityKey, scenario)}
                          onToggleAlternatives={() => setExpandedAlternatives((current) => ({
                            ...current,
                            [expansionKey]: !current[expansionKey],
                          }))}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          </div>

          <ConditionsNotice />
        </div>
      </div>
    </PublicLayout>
  );
}
