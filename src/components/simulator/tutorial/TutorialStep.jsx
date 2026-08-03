import {
  Badge,
  Button,
  Card,
  MessageBar,
  MessageBarBody,
  Text,
  Title2,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { Checkmark24Regular, Open24Regular } from '@fluentui/react-icons';
import {
  OFFICIAL_DEBT_QUERY_URL,
  formatTutorialAmount,
  tutorialDebtSummary,
  tutorialNonExpiredInstallments,
  tutorialPaymentOptions,
} from '@/config/simulatorTutorialContent';

const useStyles = makeStyles({
  root: {
    width: '100%',
    minWidth: 0,
    animationName: {
      from: { opacity: 0, transform: 'translateY(8px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    animationDuration: '180ms',
    animationTimingFunction: 'ease-out',
    '@media (prefers-reduced-motion: reduce)': {
      animationDuration: '0ms',
    },
  },
  eyebrow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '8px',
    color: tokens.colorBrandForeground1,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  title: {
    display: 'block',
    overflowWrap: 'anywhere',
    ...shorthands.margin('12px', '0', '8px'),
    scrollMarginTop: '24px',
  },
  description: {
    display: 'block',
    color: tokens.colorNeutralForeground2,
    maxWidth: '70ch',
    lineHeight: 1.5,
    overflowWrap: 'anywhere',
  },
  twoColumns: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: '20px',
    ...shorthands.margin('24px', '0', '0'),
    '@media (min-width: 960px)': {
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    },
    '& > *': {
      minWidth: 0,
    },
  },
  stack: {
    display: 'grid',
    minWidth: 0,
    gap: '12px',
  },
  callout: {
    width: '100%',
    minWidth: 0,
    maxWidth: '100%',
  },
  calloutBody: {
    minWidth: 0,
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
  },
  instruction: {
    display: 'grid',
    gridTemplateColumns: '28px minmax(0, 1fr)',
    gap: '10px',
    alignItems: 'start',
  },
  instructionIcon: {
    display: 'grid',
    width: '28px',
    height: '28px',
    placeItems: 'center',
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  mock: {
    minWidth: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    overflow: 'hidden',
    boxShadow: tokens.shadow8,
  },
  mockBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 14px',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground2,
  },
  mockDots: {
    display: 'flex',
    gap: '4px',
  },
  mockDot: {
    width: '8px',
    height: '8px',
    backgroundColor: tokens.colorNeutralStroke1,
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
  },
  mockBody: {
    display: 'grid',
    gap: '10px',
    padding: '16px',
  },
  mockField: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '12px',
    paddingBottom: '8px',
    ...shorthands.borderBottom('1px', 'dashed', tokens.colorNeutralStroke1),
  },
  mockValue: {
    minWidth: 'min(96px, 100%)',
    maxWidth: '100%',
    padding: '4px 8px',
    color: tokens.colorNeutralForeground1,
    backgroundColor: tokens.colorNeutralBackground2,
    textAlign: 'right',
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
  },
  officialLink: {
    justifySelf: 'start',
    minHeight: '44px',
  },
  url: {
    overflowWrap: 'anywhere',
    padding: '10px',
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'dashed', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  tableWrap: {
    minWidth: 0,
    maxWidth: '100%',
    overflowX: 'auto',
    overscrollBehaviorInline: 'contain',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
  },
  table: {
    width: '100%',
    minWidth: '440px',
    borderCollapse: 'collapse',
  },
  tableCell: {
    padding: '10px 12px',
    textAlign: 'left',
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1),
  },
  tableAmount: {
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    textAlign: 'right',
  },
  installment: {
    display: 'grid',
    gridTemplateColumns: '24px minmax(0, 1fr) auto',
    gap: '10px',
    alignItems: 'center',
    padding: '12px',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    '@media (max-width: 520px)': {
      gridTemplateColumns: '24px minmax(0, 1fr)',
    },
  },
  installmentContent: {
    display: 'grid',
    minWidth: 0,
    gap: '4px',
    overflowWrap: 'anywhere',
  },
  installmentBadge: {
    '@media (max-width: 520px)': {
      gridColumn: '2',
      justifySelf: 'start',
    },
  },
  checkbox: {
    width: '20px',
    height: '20px',
  },
  adjustment: {
    minWidth: 0,
    padding: '16px',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderLeft('4px', 'solid', tokens.colorBrandBackground),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  amount: {
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 700,
  },
  calculation: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: '4px',
    marginTop: '8px',
    overflowWrap: 'anywhere',
  },
  mutedAmount: {
    color: tokens.colorNeutralForeground2,
    textDecorationLine: 'line-through',
  },
  fieldCard: {
    display: 'grid',
    minWidth: 0,
    gap: '6px',
    padding: '16px',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderLeft('4px', 'solid', tokens.colorBrandBackground),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  fieldValue: {
    display: 'block',
    fontVariantNumeric: 'tabular-nums',
    fontSize: '1.25rem',
    fontWeight: 700,
  },
  calculateExample: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    color: tokens.colorNeutralForegroundOnBrand,
    backgroundColor: tokens.colorBrandBackground,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    fontWeight: 600,
  },
  paymentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
  },
  paymentCard: {
    display: 'grid',
    minWidth: 0,
    alignContent: 'start',
    gap: '8px',
    minHeight: '150px',
    padding: '16px',
  },
  discount: {
    color: tokens.colorBrandForeground1,
    fontSize: '1.5rem',
    fontWeight: 700,
  },
});

function Callouts({ callouts }) {
  const styles = useStyles();
  if (!callouts?.length) return null;
  return (
    <div className={styles.stack}>
      {callouts.map((callout) => (
        <MessageBar className={styles.callout} key={callout.text} intent={callout.intent}>
          <MessageBarBody className={styles.calloutBody}>{callout.text}</MessageBarBody>
        </MessageBar>
      ))}
    </div>
  );
}

function BrowserMock({ fields, label }) {
  const styles = useStyles();
  return (
    <section className={styles.mock} aria-label={label}>
      <div className={styles.mockBar}>
        <span className={styles.mockDots} aria-hidden="true"><span className={styles.mockDot} /><span className={styles.mockDot} /><span className={styles.mockDot} /></span>
        <Text size={200}>hconsultadeuda</Text>
      </div>
      <div className={styles.mockBody}>
        {fields.map(([name, value]) => (
          <div key={name} className={styles.mockField}>
            <Text size={200} weight="semibold">{name}</Text>
            <Text size={200} className={styles.mockValue}>{value || ' '}</Text>
          </div>
        ))}
        <div className={styles.stack} aria-label="Acciones ilustrativas no interactivas">
          <Badge appearance="filled" color="brand">Buscar</Badge>
          <Badge appearance="outline">Realizar nueva búsqueda</Badge>
        </div>
      </div>
    </section>
  );
}

function InstructionList({ instructions }) {
  const styles = useStyles();
  return (
    <div className={styles.stack}>
      {instructions.map((instruction, index) => (
        <div key={instruction} className={styles.instruction}>
          <span className={styles.instructionIcon} aria-hidden="true">{index + 1}</span>
          <Text>{instruction}</Text>
        </div>
      ))}
    </div>
  );
}

function PaymentCards({ options = tutorialPaymentOptions }) {
  const styles = useStyles();
  return (
    <div className={styles.paymentGrid}>
      {options.map((option) => (
        <Card key={option.title} className={styles.paymentCard}>
          <Text className={styles.discount}>{option.discount}</Text>
          <Text weight="semibold">{option.title}</Text>
          <Text size={200} className={styles.description}>{option.detail}</Text>
        </Card>
      ))}
    </div>
  );
}

export function TutorialStep({ step, headingRef, selectedInstallments, onInstallmentChange }) {
  const styles = useStyles();
  const selectedItems = tutorialNonExpiredInstallments.filter((item) => selectedInstallments.includes(item.id));
  const urbanaSubtraction = selectedItems.reduce((total, item) => total + item.urbanaCents, 0);
  const salubridadSubtraction = selectedItems.reduce((total, item) => total + item.salubridadCents, 0);
  const principalBase = tutorialDebtSummary
    .filter((item) => item.destination === 'Principal')
    .reduce((total, item) => total + item.amountCents, 0);
  const fines = tutorialDebtSummary
    .filter((item) => item.destination === 'Multas')
    .reduce((total, item) => total + item.amountCents, 0);
  const surcharges = tutorialDebtSummary
    .filter((item) => item.destination === 'Recargos')
    .reduce((total, item) => total + item.amountCents, 0);
  const principal = principalBase - urbanaSubtraction - salubridadSubtraction;

  return (
    <section className={styles.root} aria-labelledby={`tutorial-step-${step.id}`}>
      <div className={styles.eyebrow}><Badge appearance="filled" color="brand">{step.eyebrow}</Badge> Cómo usar el simulador</div>
      <Title2 as="h2" ref={headingRef} id={`tutorial-step-${step.id}`} tabIndex={-1} className={styles.title}>{step.title}</Title2>
      <Text className={styles.description}>{step.description}</Text>

      {step.id === 'inicio' && (
        <div className={styles.twoColumns}>
          <InstructionList instructions={step.instructions} />
          <Callouts callouts={step.callouts} />
        </div>
      )}

      {step.id === 'consulta' && (
        <div className={styles.twoColumns}>
          <div className={styles.stack}>
            <Button as="a" className={styles.officialLink} appearance="primary" icon={<Open24Regular />} iconPosition="after" href={OFFICIAL_DEBT_QUERY_URL} target="_blank" rel="noopener noreferrer">
              Abrir consulta de deuda
            </Button>
            <Text size={200} className={styles.url}>{OFFICIAL_DEBT_QUERY_URL.replace('https://', '')}</Text>
            <Callouts callouts={step.callouts} />
          </div>
          <BrowserMock label="Vista ilustrativa del formulario inicial de consulta de tributos" fields={[['Tipo Padrón', 'URBANA'], ['Acción', 'Buscar']]} />
        </div>
      )}

      {step.id === 'padron' && (
        <div className={styles.twoColumns}>
          <InstructionList instructions={step.instructions} />
              <BrowserMock label="Vista ilustrativa del formulario con datos del padrón" fields={[['Tipo Padrón', 'URBANA'], ['ID de Padrón', '999XXX'], ['N.º Padrón', ''], ['PH', ''], ['Block', ''], ['Localidad', 'MINAS']]} />
        </div>
      )}

      {step.id === 'resumen' && (
        <div className={styles.twoColumns}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption>Resumen de deuda de ejemplo</caption>
              <thead><tr><th className={styles.tableCell}>Concepto</th><th className={`${styles.tableCell} ${styles.tableAmount}`}>Importe</th></tr></thead>
              <tbody>
                {tutorialDebtSummary.map((item) => <tr key={item.concept}><td className={styles.tableCell}>{item.concept}</td><td className={`${styles.tableCell} ${styles.tableAmount}`}>$ {formatTutorialAmount(item.amountCents)}</td></tr>)}
              </tbody>
            </table>
          </div>
          <Callouts callouts={step.callouts} />
        </div>
      )}

      {step.id === 'restar' && (
        <div className={styles.twoColumns}>
          <div className={styles.stack}>
            {tutorialNonExpiredInstallments.map((item) => {
              const isSelected = selectedInstallments.includes(item.id);
              return <label key={item.id} className={styles.installment}>
                <input className={styles.checkbox} type="checkbox" checked={isSelected} onChange={() => onInstallmentChange(item.id)} />
                <span className={styles.installmentContent}><Text weight="semibold">{item.label} · {item.date}</Text><Text size={200} className={styles.description}>CONT. URBANA $ {formatTutorialAmount(item.urbanaCents)} + SALUBRIDAD $ {formatTutorialAmount(item.salubridadCents)}</Text></span>
                <Badge className={styles.installmentBadge} appearance="outline">No vencida</Badge>
              </label>;
            })}
            <Callouts callouts={step.callouts} />
          </div>
          <div className={styles.stack}>
            <Card className={styles.adjustment}><Text size={200}>CONT. URBANA</Text><div className={styles.calculation}><Text className={mergeClasses(styles.amount, styles.mutedAmount)}>$ {formatTutorialAmount(1295164)}</Text><Text>−</Text><Text className={styles.amount}>$ {formatTutorialAmount(urbanaSubtraction)}</Text><Text>=</Text><Text className={styles.amount}>$ {formatTutorialAmount(1295164 - urbanaSubtraction)}</Text></div></Card>
            <Card className={styles.adjustment}><Text size={200}>SALUBRIDAD Y LIMPIEZA URBANA</Text><div className={styles.calculation}><Text className={mergeClasses(styles.amount, styles.mutedAmount)}>$ {formatTutorialAmount(2960936)}</Text><Text>−</Text><Text className={styles.amount}>$ {formatTutorialAmount(salubridadSubtraction)}</Text><Text>=</Text><Text className={styles.amount}>$ {formatTutorialAmount(2960936 - salubridadSubtraction)}</Text></div></Card>
          </div>
        </div>
      )}

      {step.id === 'campos' && (
        <div className={styles.twoColumns}>
          <div className={styles.tableWrap}><table className={styles.table}><caption>Rubros y destino en el simulador</caption><thead><tr><th className={styles.tableCell}>Concepto</th><th className={styles.tableCell}>Va a</th></tr></thead><tbody>{tutorialDebtSummary.map((item) => <tr key={item.concept}><td className={styles.tableCell}>{item.concept}</td><td className={styles.tableCell}><Badge appearance="outline">{item.destination}</Badge></td></tr>)}</tbody></table></div>
          <div className={styles.stack}>
            <Card className={styles.fieldCard}><Text size={200}>DEUDA TRIBUTARIA PRINCIPAL</Text><Text className={styles.fieldValue}>$ {formatTutorialAmount(principal)}</Text><Text size={200} className={styles.description}>Sin cuotas no vencidas del ejemplo.</Text></Card>
            <Card className={styles.fieldCard}><Text size={200}>MULTAS</Text><Text className={styles.fieldValue}>$ {formatTutorialAmount(fines)}</Text></Card>
            <Card className={styles.fieldCard}><Text size={200}>RECARGOS</Text><Text className={styles.fieldValue}>$ {formatTutorialAmount(surcharges)}</Text></Card>
          </div>
        </div>
      )}

      {step.id === 'calcular' && (
        <div className={styles.twoColumns}>
          <div className={styles.stack}>
            <Card className={styles.fieldCard}><Text weight="semibold">Deuda tributaria principal</Text><Text className={styles.fieldValue}>$ {formatTutorialAmount(principal)}</Text></Card>
            <Card className={styles.fieldCard}><Text weight="semibold">Multas</Text><Text className={styles.fieldValue}>$ {formatTutorialAmount(fines)}</Text></Card>
            <Card className={styles.fieldCard}><Text weight="semibold">Recargos</Text><Text className={styles.fieldValue}>$ {formatTutorialAmount(surcharges)}</Text></Card>
            <div className={styles.calculateExample} aria-label="Ejemplo visual del botón Calcular, no interactivo"><Checkmark24Regular aria-hidden="true" /> Calcular</div>
          </div>
          <div className={styles.stack}><PaymentCards options={tutorialPaymentOptions.slice(1)} /><Callouts callouts={step.callouts} /></div>
        </div>
      )}

      {step.id === 'modalidades' && <div className={styles.stack}><PaymentCards /><Callouts callouts={step.callouts} /></div>}
    </section>
  );
}
