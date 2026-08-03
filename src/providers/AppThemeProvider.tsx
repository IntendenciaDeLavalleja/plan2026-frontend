import { FluentProvider } from '@fluentui/react-components';
import { type ReactNode, useMemo } from 'react';
import { ColorModeProvider, useColorMode } from '@/theme/useColorMode';
import { darkTheme, lightTheme } from '@/theme/fluentTheme';

interface Props {
  children: ReactNode;
}

export function AppThemeProvider({ children }: Props) {
  return (
    <ColorModeProvider>
      <AppThemeContent>{children}</AppThemeContent>
    </ColorModeProvider>
  );
}

function AppThemeContent({ children }: Props) {
  const { mode } = useColorMode();
  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);
  return <FluentProvider theme={theme}>{children}</FluentProvider>;
}
