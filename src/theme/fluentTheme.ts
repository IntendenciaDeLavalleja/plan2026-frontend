// Institutional Fluent 2 theme overrides for the Amnistia Financiera system.
// We build on top of webLightTheme / webDarkTheme but tweak brand colors so
// the app feels like a real government portal (deep blue / indigo accents).
import {
  createLightTheme,
  createDarkTheme,
  type BrandVariants,
  type Theme,
} from '@fluentui/react-components';

const afBrand: BrandVariants = {
  10: '#02061a',
  20: '#0a1230',
  30: '#101a4a',
  40: '#17226a',
  50: '#1f2d8a',
  60: '#283aa3',
  70: '#3146c1',
  80: '#3e57d4',
  90: '#5472e8',
  100: '#7591f4',
  110: '#9bb1fa',
  120: '#bccbfc',
  130: '#dde4fd',
  140: '#eef2fe',
  150: '#f8faff',
  160: '#ffffff',
};

export const lightTheme: Theme = createLightTheme(afBrand);
export const darkTheme: Theme = createDarkTheme(afBrand);

export { afBrand };
