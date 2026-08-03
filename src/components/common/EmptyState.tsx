import { Caption1, Text } from '@fluentui/react-components';
import type { ReactNode } from 'react';
import { Info24Regular } from '@fluentui/react-icons';

interface Props {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        border: '1px dashed var(--af-border)',
        borderRadius: 16,
        background: 'var(--af-surface)',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'var(--af-institutional-gradient-soft)',
          color: 'var(--af-primary)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {icon ?? <Info24Regular />}
      </div>
      <Text weight="semibold" size={400}>
        {title}
      </Text>
      {description && (
        <Caption1 style={{ maxWidth: 360 }}>{description}</Caption1>
      )}
      {action}
    </div>
  );
}
