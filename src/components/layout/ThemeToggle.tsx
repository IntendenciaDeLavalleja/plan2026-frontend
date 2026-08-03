import { Button, Tooltip } from '@fluentui/react-components';
import { DarkTheme24Regular, WeatherSunny24Regular } from '@fluentui/react-icons';
import { useColorMode } from '@/theme/useColorMode';

export function ThemeToggle() {
  const { mode, toggle } = useColorMode();
  const isDark = mode === 'dark';
  return (
    <Tooltip content={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'} relationship="label">
      <Button
        appearance="subtle"
        icon={isDark ? <WeatherSunny24Regular /> : <DarkTheme24Regular />}
        aria-label="Alternar tema"
        onClick={toggle}
      />
    </Tooltip>
  );
}
