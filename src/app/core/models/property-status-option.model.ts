import { StatusSeverity } from './option-ref.model';

// Nomme "Option" pour ne pas entrer en collision avec OptionRef/PropertyStatusRef
// (deja utilise par Property.propertyStatus) -- ce fichier-ci modelise les
// reponses du CRUD de Parametres (avec organizationId/createdAt).
export interface PropertyStatusOptionResponse {
  id: string;
  organizationId: string;
  nameEn: string;
  nameFr: string;
  description: string | null;
  severity: StatusSeverity;
  createdAt: string;
}

export interface CreatePropertyStatusOptionRequest {
  organizationId: string;
  nameEn: string;
  nameFr: string;
  description: string | null;
  severity: StatusSeverity;
}

export interface UpdatePropertyStatusOptionRequest {
  nameEn: string;
  nameFr: string;
  description: string | null;
  severity: StatusSeverity;
}
