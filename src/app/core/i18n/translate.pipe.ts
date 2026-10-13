import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from './i18n.service';

/**
 * impure (pure:false) volontairement : la cle d'entree ne change pas
 * quand on bascule la langue (un signal injecte, pas un @Input), donc
 * une pipe pure ne se re-executerait jamais au changement de langue.
 */
@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: string, params?: Record<string, string>): string {
    return this.i18n.translate(key, params);
  }
}
