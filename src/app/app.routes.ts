import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    // Public : formulaire de candidature, pas de garde d'authentification
    // -- un candidat a la location n'a pas de compte (voir ApplyComponent).
    path: 'apply/:propertyId/:unitId',
    loadComponent: () => import('./features/apply/apply.component').then((m) => m.ApplyComponent),
  },
  {
    // Espace locataire : public lui aussi, accessible par numero de suivi
    // seul (voir ApplicationPublicStatusController cote backend) --
    // aucun compte/mot de passe, comme le suivi d'une commande.
    path: 'tenant-portal',
    loadComponent: () => import('./features/tenant-portal/shell/tenant-shell.component').then((m) => m.TenantShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'applications' },
      {
        path: 'applications',
        loadComponent: () =>
          import('./features/tenant-portal/placeholder/tenant-placeholder.component').then((m) => m.TenantPlaceholderComponent),
        data: { title: 'Mes dossiers' },
      },
      {
        path: 'applications/:applicationId',
        loadComponent: () => import('./features/tenant-portal/dossier/tenant-dossier.component').then((m) => m.TenantDossierComponent),
      },
      {
        path: 'applications/:applicationId/decision',
        loadComponent: () =>
          import('./features/tenant-portal/decision/tenant-decision.component').then((m) => m.TenantDecisionComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/tenant-portal/placeholder/tenant-placeholder.component').then((m) => m.TenantPlaceholderComponent),
        data: { title: 'Tableau de bord' },
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./features/tenant-portal/placeholder/tenant-placeholder.component').then((m) => m.TenantPlaceholderComponent),
        data: { title: 'Mes documents' },
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./features/tenant-portal/placeholder/tenant-placeholder.component').then((m) => m.TenantPlaceholderComponent),
        data: { title: 'Mes paiements' },
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/tenant-portal/placeholder/tenant-placeholder.component').then((m) => m.TenantPlaceholderComponent),
        data: { title: 'Mon profil' },
      },
    ],
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'properties',
        loadComponent: () => import('./features/properties/property-list/property-list.component').then((m) => m.PropertyListComponent),
      },
      {
        path: 'properties/new',
        loadComponent: () => import('./features/properties/property-form/property-form.component').then((m) => m.PropertyFormComponent),
      },
      {
        path: 'properties/:propertyId/edit',
        loadComponent: () => import('./features/properties/property-form/property-form.component').then((m) => m.PropertyFormComponent),
      },
      {
        path: 'properties/:propertyId',
        loadComponent: () =>
          import('./features/properties/property-detail/property-detail.component').then((m) => m.PropertyDetailComponent),
      },
      {
        path: 'properties/:propertyId/units/new',
        loadComponent: () => import('./features/properties/unit-form/unit-form.component').then((m) => m.UnitFormComponent),
      },
      {
        path: 'properties/:propertyId/units/:unitId/edit',
        loadComponent: () => import('./features/properties/unit-form/unit-form.component').then((m) => m.UnitFormComponent),
      },
      {
        path: 'properties/:propertyId/units/:unitId',
        loadComponent: () => import('./features/properties/unit-detail/unit-detail.component').then((m) => m.UnitDetailComponent),
      },
      {
        path: 'properties/:propertyId/units/:unitId/leases/:leaseId',
        loadComponent: () => import('./features/properties/lease-detail/lease-detail.component').then((m) => m.LeaseDetailComponent),
      },
      {
        path: 'properties/:propertyId/units/:unitId/applications/:applicationId/review',
        loadComponent: () =>
          import('./features/properties/application-review/application-review.component').then((m) => m.ApplicationReviewComponent),
      },
      {
        path: 'owners',
        loadComponent: () => import('./features/owners/owner-list.component').then((m) => m.OwnerListComponent),
      },
      {
        path: 'tenants',
        loadComponent: () => import('./features/tenants/tenant-list.component').then((m) => m.TenantListComponent),
      },
      {
        path: 'admin/jurisdiction-rules',
        loadComponent: () =>
          import('./features/admin/jurisdiction-rule-list.component').then((m) => m.JurisdictionRuleListComponent),
      },
      // Elements du menu gestionnaire issus de la maquette (ecran 09) mais
      // sans fonctionnalite dediee dans ce MVP -- voir ManagerPlaceholderComponent.
      {
        path: 'apartments',
        loadComponent: () => import('./features/placeholder/manager-placeholder.component').then((m) => m.ManagerPlaceholderComponent),
        data: { title: 'Appartements' },
      },
      {
        path: 'applications',
        loadComponent: () => import('./features/placeholder/manager-placeholder.component').then((m) => m.ManagerPlaceholderComponent),
        data: { title: 'Dossiers de location' },
      },
      {
        path: 'leases',
        loadComponent: () => import('./features/placeholder/manager-placeholder.component').then((m) => m.ManagerPlaceholderComponent),
        data: { title: 'Baux' },
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/placeholder/manager-placeholder.component').then((m) => m.ManagerPlaceholderComponent),
        data: { title: 'Paiements' },
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/placeholder/manager-placeholder.component').then((m) => m.ManagerPlaceholderComponent),
        data: { title: 'Rapports' },
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings-home.component').then((m) => m.SettingsHomeComponent),
      },
      {
        path: 'settings/apartment-types',
        loadComponent: () =>
          import('./features/settings/apartment-types/apartment-type-list.component').then((m) => m.ApartmentTypeListComponent),
      },
      {
        path: 'settings/property-types',
        loadComponent: () =>
          import('./features/settings/property-types/property-type-list.component').then((m) => m.PropertyTypeListComponent),
      },
      {
        path: 'settings/property-statuses',
        loadComponent: () =>
          import('./features/settings/property-statuses/property-status-list.component').then((m) => m.PropertyStatusListComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
