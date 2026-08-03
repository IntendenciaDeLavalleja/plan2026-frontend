import { Button, Text, Title3 } from '@fluentui/react-components';
import { ArrowClockwise24Regular, Warning24Regular } from '@fluentui/react-icons';

interface Props {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Algo salió mal',
  description = 'No pudimos cargar la información. Intenta nuevamente.',
  onRetry,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        border: '1px solid var(--af-border)',
        borderRadius: 16,
        background: 'var(--af-surface)',
        gap: 12,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'rgba(185, 28, 28, 0.08)',
          color: 'var(--af-danger)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Warning24Regular />
      </div>
      <Title3>{title}</Title3>
      <Text style={{ maxWidth: 420 }}>{description}</Text>
      {onRetry && (
        <Button
          appearance="primary"
          icon={<ArrowClockwise24Regular />}
          onClick={onRetry}
        >
          Reintentar
        </Button>
      )}
    </div>
  );
}
