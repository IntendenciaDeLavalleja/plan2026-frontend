import {
  Body1Strong,
  Card,
  CardHeader,
} from '@fluentui/react-components';
import type { ReactNode } from 'react';

interface Props {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  body?: ReactNode;
  children?: ReactNode;
  variant?: 'plain' | 'elevated';
  className?: string;
  style?: React.CSSProperties;
}

export function SectionCard({
  title,
  description,
  icon,
  action,
  body,
  children,
  variant = 'plain',
  style,
  className,
}: Props) {
  return (
    <Card
      className={className}
      style={{
        borderRadius: 16,
        boxShadow: variant === 'elevated' ? '0 12px 32px rgba(15,23,42,0.07)' : 'none',
        ...style,
      }}
    >
      <CardHeader
        image={icon as never}
        header={<Body1Strong>{title}</Body1Strong>}
        description={description as never}
        action={action as never}
      />
      {body ?? children}
    </Card>
  );
}
