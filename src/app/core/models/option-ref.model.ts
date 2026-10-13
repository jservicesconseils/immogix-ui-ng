// Reference legere vers une entree d'une liste Parametres (type
// d'appartement, type ou statut de propriete), embarquee dans
// PropertyResponse/UnitResponse -- miroir de ca.immogix.core.settings.dto.OptionRef
// cote backend. Un seul nom par entree : un utilisateur travaille dans
// une seule langue a la fois (voir I18nService), la saisie n'est jamais
// bilingue -- name est simplement ce que l'organisation a tape.
export interface OptionRef {
  id: string;
  name: string;
}

export type StatusSeverity = 'success' | 'warn' | 'danger' | 'secondary' | 'info';

export interface PropertyStatusRef extends OptionRef {
  severity: StatusSeverity;
}
