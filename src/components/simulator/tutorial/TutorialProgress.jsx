import { Button, ProgressBar, Text, makeStyles, mergeClasses, shorthands, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gap: '12px',
  },
  steps: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  step: {
    minWidth: '44px',
    minHeight: '44px',
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
  },
  active: {
    ...shorthands.border('2px', 'solid', tokens.colorBrandBackground),
  },
  label: {
    color: tokens.colorNeutralForeground2,
  },
});

export function TutorialProgress({ currentStep, steps, onStepChange }) {
  const styles = useStyles();
  const value = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={styles.root}>
      <div className={styles.steps} aria-label="Pasos del tutorial">
        {steps.map((step, index) => (
          <Button
            key={step.id}
            className={mergeClasses(styles.step, index === currentStep && styles.active)}
            appearance={index === currentStep ? 'primary' : 'subtle'}
            aria-label={`Ir al paso ${index + 1}: ${step.label}`}
            aria-current={index === currentStep ? 'step' : undefined}
            onClick={() => onStepChange(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
      <ProgressBar
        value={value / 100}
        aria-label="Progreso del tutorial"
        aria-valuetext={`Paso ${currentStep + 1} de ${steps.length}`}
      />
      <Text className={styles.label} size={200}>Paso {currentStep + 1} de {steps.length}</Text>
    </div>
  );
}
