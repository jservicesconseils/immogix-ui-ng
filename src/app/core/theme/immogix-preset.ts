import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Theme PrimeNG derive d'Aura, meme structure que CornalixPreset
 * (jservicesconseils/cornalix-ui) mais recale sur une palette bleue --
 * "meme visuel, meme librairie, seule la couleur change".
 */
export const ImmogixPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#EBF2FE',
      100: '#CFE0FC',
      200: '#A6C5F9',
      300: '#7AA7F5',
      400: '#4F89F0',
      500: '#2563EB',
      600: '#1D4ED8',
      700: '#1E40AF',
      800: '#1E3A8A',
      900: '#172554',
      950: '#0B1530',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#FFFFFF',
          50: '#F1F4F9',
          100: '#E6EAF2',
          200: '#CBD4E3',
          300: '#A9B7D1',
          400: '#8A9BBD',
          500: '#7C8EAE',
          600: '#5F7090',
          700: '#485A74',
          800: '#2E3C57',
          900: '#13203A',
          950: '#0A1222',
        },
        primary: {
          color: '#1D4ED8',
          contrastColor: '#FFFFFF',
          hoverColor: '#1E40AF',
          activeColor: '#1E3A8A',
        },
        highlight: {
          background: '#DCE7FB',
          focusBackground: '#CFE0FC',
          color: '#1E40AF',
          focusColor: '#1E40AF',
        },
      },
      dark: {
        surface: {
          0: '#FFFFFF',
          50: '#F1F4F9',
          100: '#E6EAF2',
          200: '#CBD4E3',
          300: '#A9B7D1',
          400: '#8A9BBD',
          500: '#7C8EAE',
          600: '#5F7090',
          700: '#485A74',
          800: '#2E3C57',
          900: '#13203A',
          950: '#0A1222',
        },
      },
    },
  },
});

/** Palette fixe utilisee par les graphiques (hors jetons PrimeNG, directement en hex pour Chart.js). */
export const CHART_COLORS = {
  occupied: '#4f46e5',
  vacant: '#f59e0b',
  revenue: '#10b981',
  expenses: '#f43f5e',
  maintenance: '#f97316',
  neutral: '#94a3b8',
};
