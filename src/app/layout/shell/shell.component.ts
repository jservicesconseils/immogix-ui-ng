import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../core/auth/auth.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { Locale } from '../../core/i18n/locale';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

interface NavItem {
  translationKey: string;
  icon: string;
  route: string;
}

/**
 * Meme structure/style que le Shell de cornalix-ui (jservicesconseils/
 * cornalix-ui) : sidebar degradee avec logo + nav, tiroir hors-canevas
 * sous 860px, topbar avec menu utilisateur en p-menu -- seule la teinte
 * change (bleu plutot que sarcelle, voir immogix-preset.ts/styles.scss).
 */
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AvatarModule, ButtonModule, MenuModule, TranslatePipe],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  readonly session = this.auth.session;
  readonly mobileNavOpen = signal(false);
  readonly locale = this.i18n.locale;

  // Liste et ordre alignes sur la maquette de reference (ecran 09). Les
  // routes sans page dediee dans ce MVP pointent vers une page "bientot
  // disponible" (voir ManagerPlaceholderComponent) plutot que de laisser
  // un lien mort. Propriétaires et Règles juridictionnelles sont des
  // fonctionnalites reelles absentes de la maquette -- ajoutees en fin
  // de liste plutot que supprimees.
  readonly navItems: NavItem[] = [
    { translationKey: 'shell.nav.dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { translationKey: 'shell.nav.properties', icon: 'pi pi-building', route: '/properties' },
    { translationKey: 'shell.nav.apartments', icon: 'pi pi-th-large', route: '/apartments' },
    { translationKey: 'shell.nav.applications', icon: 'pi pi-file', route: '/applications' },
    { translationKey: 'shell.nav.tenants', icon: 'pi pi-users', route: '/tenants' },
    { translationKey: 'shell.nav.leases', icon: 'pi pi-file-edit', route: '/leases' },
    { translationKey: 'shell.nav.payments', icon: 'pi pi-wallet', route: '/payments' },
    { translationKey: 'shell.nav.reports', icon: 'pi pi-chart-bar', route: '/reports' },
    { translationKey: 'shell.nav.settings', icon: 'pi pi-cog', route: '/settings' },
    { translationKey: 'shell.nav.owners', icon: 'pi pi-id-card', route: '/owners' },
    { translationKey: 'shell.nav.jurisdictionRules', icon: 'pi pi-shield', route: '/admin/jurisdiction-rules' },
  ];

  // computed (pas un tableau fige) : p-menu lit [model] une fois au
  // moment du rendu, un tableau statique ne se regenererait jamais quand
  // la langue change.
  readonly userMenuItems = computed<MenuItem[]>(() => [
    { label: this.i18n.translate('shell.userMenu.logout'), icon: 'pi pi-sign-out', command: () => this.logout() },
  ]);

  setLocale(locale: Locale): void {
    this.i18n.setLocale(locale);
  }

  initials(): string {
    const name = this.session()?.displayName ?? '';
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  toggleMobileNav(): void {
    this.mobileNavOpen.update((open) => !open);
  }

  closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
