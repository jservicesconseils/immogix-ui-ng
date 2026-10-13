import { Injectable, computed, signal } from '@angular/core';
import { EN } from './en';
import { FR } from './fr';
import { Locale } from './locale';

const STORAGE_KEY = 'immogix.locale';

const DICTIONARIES: Record<Locale, Record<string, string>> = { en: EN, fr: FR };

/**
 * Service d'internationalisation maison (EN/FR) : pas de @angular/localize
 * (qui exige une recompilation par langue, incompatible avec un
 * selecteur de langue instantane) ni de ngx-translate (dependance
 * externe non necessaire pour 2 langues) -- un simple dictionnaire par
 * signal, suffisant pour la portee actuelle.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly localeSignal = signal<Locale>(this.restoreLocale());

  readonly locale = this.localeSignal.asReadonly();
  readonly isEnglish = computed(() => this.localeSignal() === 'en');

  setLocale(locale: Locale): void {
    this.localeSignal.set(locale);
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Navigation privee / stockage bloque : la langue reste active pour
      // la session en cours, simplement pas memorisee d'une visite a l'autre.
    }
  }

  // {{name}}-style interpolation uniquement (pas de pluriel/format complexe
  // -- hors besoin actuel).
  translate(key: string, params?: Record<string, string>): string {
    const dictionary = DICTIONARIES[this.localeSignal()];
    let value = dictionary[key] ?? FR[key] ?? key;
    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        value = value.replace(`{{${paramKey}}}`, paramValue);
      }
    }
    return value;
  }

  // Choisit nameEn/nameFr selon la langue active, pour afficher un
  // OptionRef (type d'appartement, type/statut de propriete) sans passer
  // par le dictionnaire de traduction statique.
  optionName(option: { nameEn: string; nameFr: string } | null | undefined): string {
    if (!option) {
      return '—';
    }
    return this.isEnglish() ? option.nameEn : option.nameFr;
  }

  private restoreLocale(): Locale {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'fr') {
        return stored;
      }
    } catch {
      // Stockage inaccessible : on retombe sur la langue du navigateur.
    }
    return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'fr';
  }
}
