import { ArrowLeft24Regular, ArrowRight24Regular, Calculator24Regular } from '@fluentui/react-icons';
import { Button, makeStyles, shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    ...shorthands.margin('24px', '0', '0'),
    '@media (max-width: 480px)': {
      flexDirection: 'column-reverse',
    },
  },
  button: {
    minHeight: '44px',
    '@media (max-width: 480px)': {
      width: '100%',
    },
  },
});

export function TutorialNavigation({ isFirstStep, isLastStep, onPrevious, onNext, onStart }) {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Button
        className={styles.button}
        appearance="secondary"
        icon={<ArrowLeft24Regular />}
        disabled={isFirstStep}
        onClick={onPrevious}
      >
        Anterior
      </Button>
      {isLastStep ? (
        <Button className={styles.button} appearance="primary" icon={<Calculator24Regular />} onClick={onStart}>
          Comenzar simulación
        </Button>
      ) : (
        <Button className={styles.button} appearance="primary" icon={<ArrowRight24Regular />} iconPosition="after" onClick={onNext}>
          Siguiente
        </Button>
      )}
    </div>
  );
}
