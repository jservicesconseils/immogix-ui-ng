// Nomme "Option" pour ne pas entrer en collision avec le type PropertyStatus
// (union de string) deja utilise dans property.model.ts pour le champ
// Property.status -- ce fichier-ci alimente uniquement les ecrans de
// Parametres (liste configurable par organisation), independants de cet
// enum fixe.
export interface PropertyStatusOptionResponse {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface CreatePropertyStatusOptionRequest {
  organizationId: string;
  name: string;
  description: string | null;
}

export interface UpdatePropertyStatusOptionRequest {
  name: string;
  description: string | null;
}
