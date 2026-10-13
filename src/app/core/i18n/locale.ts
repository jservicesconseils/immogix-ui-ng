export type Locale = 'en' | 'fr';

export const LOCALES: readonly Locale[] = ['en', 'fr'];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
};
