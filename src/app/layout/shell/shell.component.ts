import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../core/auth/auth.service';

interface NavItem {
  label: string;
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
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AvatarModule, ButtonModule, MenuModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly session = this.auth.session;
  readonly mobileNavOpen = signal(false);

  // Liste et ordre alignes sur la maquette de reference (ecran 09). Les
  // routes sans page dediee dans ce MVP pointent vers une page "bientot
  // disponible" (voir ManagerPlaceholderComponent) plutot que de laisser
  // un lien mort. Propriétaires et Règles juridictionnelles sont des
  // fonctionnalites reelles absentes de la maquette -- ajoutees en fin
  // de liste plutot que supprimees.
  readonly navItems: NavItem[] = [
    { label: 'Tableau de bord', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Immeubles', icon: 'pi pi-building', route: '/properties' },
    { label: 'Appartements', icon: 'pi pi-th-large', route: '/appartements' },
    { label: 'Dossiers de location', icon: 'pi pi-file', route: '/dossiers-location' },
    { label: 'Locataires', icon: 'pi pi-users', route: '/tenants' },
    { label: 'Baux', icon: 'pi pi-file-edit', route: '/baux' },
    { label: 'Paiements', icon: 'pi pi-wallet', route: '/paiements' },
    { label: 'Rapports', icon: 'pi pi-chart-bar', route: '/rapports' },
    { label: 'Paramètres', icon: 'pi pi-cog', route: '/parametres' },
    { label: 'Propriétaires', icon: 'pi pi-id-card', route: '/owners' },
    { label: 'Règles juridictionnelles', icon: 'pi pi-shield', route: '/admin/jurisdiction-rules' },
  ];

  readonly userMenuItems: MenuItem[] = [
    { label: 'Déconnexion', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

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
