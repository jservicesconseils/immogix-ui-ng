// Reference legere vers une entree d'une liste Parametres (type
// d'appartement, type ou statut de propriete), embarquee dans
// PropertyResponse/UnitResponse -- miroir de ca.immogix.core.settings.dto.OptionRef
// cote backend. nameEn/nameFr permettent d'afficher le bon libelle selon
// la langue active sans aller-retour supplementaire (voir I18nService).
export interface OptionRef {
  id: string;
  nameEn: string;
  nameFr: string;
}

export type StatusSeverity = 'success' | 'warn' | 'danger' | 'secondary' | 'info';

export interface PropertyStatusRef extends OptionRef {
  severity: StatusSeverity;
}
