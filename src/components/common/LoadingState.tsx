import { Spinner, Text } from '@fluentui/react-components';

interface Props {
  label?: string;
  fullscreen?: boolean;
}

export function LoadingState({ label = 'Cargando…', fullscreen }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: fullscreen ? '80px 24px' : '32px 24px',
        gap: 12,
      }}
    >
      <Spinner size="large" />
      <Text>{label}</Text>
    </div>
  );
}
