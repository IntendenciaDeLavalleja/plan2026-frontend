import { useEffect, useRef, useState } from 'react';
import { Button, Card, Text, Title1, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { ArrowRight24Regular, Info24Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { simulatorTutorialSteps, tutorialNonExpiredInstallments } from '@/config/simulatorTutorialContent';
import { TutorialNavigation } from './TutorialNavigation';
import { TutorialProgress } from './TutorialProgress';
import { TutorialStep } from './TutorialStep';
import {
  getNextTutorialStepIndex,
  getPreviousTutorialStepIndex,
  isLastTutorialStep,
  SIMULATOR_CALCULATOR_PATH,
} from './tutorialState';

const useStyles = makeStyles({
  page: {
    padding: '40px 0 64px',
    scrollMarginTop: '220px',
    '@media (max-width: 640px)': {
      padding: '24px 0 40px',
      scrollMarginTop: '260px',
    },
  },
  container: {
    width: 'min(100% - 32px, 1040px)',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '20px',
    '@media (max-width: 640px)': {
      flexDirection: 'column',
    },
  },
  heading: {
    display: 'grid',
    gap: '8px',
  },
  subtitle: {
    color: tokens.colorNeutralForeground2,
    maxWidth: '65ch',
  },
  skip: {
    minHeight: '44px',
    flexShrink: 0,
    '@media (max-width: 640px)': {
      width: '100%',
    },
  },
  stage: {
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    padding: 'clamp(20px, 4vw, 44px)',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    boxShadow: tokens.shadow8,
  },
  progress: {
    marginBottom: '28px',
  },
  status: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
  note: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    marginTop: '18px',
    color: tokens.colorNeutralForeground2,
  },
});

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function SimulatorTutorial() {
  const styles = useStyles();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInstallments, setSelectedInstallments] = useState(() => tutorialNonExpiredInstallments.map((item) => item.id));
  const headingRef = useRef(null);
  const previousStepRef = useRef(currentStep);
  const tutorialRef = useRef(null);
  const step = simulatorTutorialSteps[currentStep];
  const lastStep = isLastTutorialStep(currentStep, simulatorTutorialSteps.length);

  useEffect(() => {
    if (previousStepRef.current === currentStep) return;
    previousStepRef.current = currentStep;
    headingRef.current?.focus({ preventScroll: true });
    tutorialRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }, [currentStep]);

  function changeStep(index) {
    setCurrentStep(Math.min(Math.max(0, index), simulatorTutorialSteps.length - 1));
  }

  function toggleInstallment(id) {
    setSelectedInstallments((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]);
  }

  function openSimulator() {
    navigate(SIMULATOR_CALCULATOR_PATH);
  }

  return (
    <div className={styles.page} ref={tutorialRef}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.heading}>
            <Text weight="semibold">Cómo usar el simulador</Text>
            <Title1 as="h1">Guía para estimar una quita</Title1>
            <Text className={styles.subtitle}>Revisá de dónde salen los importes y compará las alternativas antes de hacer una simulación informativa.</Text>
          </div>
          <Button className={styles.skip} appearance="secondary" icon={<ArrowRight24Regular />} iconPosition="after" onClick={openSimulator}>
            Omitir explicación e ir al simulador
          </Button>
        </header>

        <Card className={styles.stage}>
          <div className={styles.progress}><TutorialProgress currentStep={currentStep} steps={simulatorTutorialSteps} onStepChange={changeStep} /></div>
          <div className={styles.status} role="status" aria-live="polite">Paso {currentStep + 1} de {simulatorTutorialSteps.length}: {step.title}</div>
          <TutorialStep key={step.id} step={step} headingRef={headingRef} selectedInstallments={selectedInstallments} onInstallmentChange={toggleInstallment} />
          <TutorialNavigation
            isFirstStep={currentStep === 0}
            isLastStep={lastStep}
            onPrevious={() => changeStep(getPreviousTutorialStepIndex(currentStep))}
            onNext={() => changeStep(getNextTutorialStepIndex(currentStep, simulatorTutorialSteps.length))}
            onStart={openSimulator}
          />
        </Card>

        <Text className={styles.note} size={200}><Info24Regular aria-hidden="true" /> Podés omitir la guía en cualquier momento. El resultado del simulador es estimativo y puede variar en otra fecha.</Text>
      </div>
    </div>
  );
}
