// Nomme "Option" pour ne pas entrer en collision avec le type PropertyType
// (union de string) deja utilise dans property.model.ts pour le champ
// Property.type -- ce fichier-ci alimente uniquement les ecrans de
// Parametres (liste configurable par organisation), independants de cet
// enum fixe.
export interface PropertyTypeOptionResponse {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface CreatePropertyTypeOptionRequest {
  organizationId: string;
  name: string;
  description: string | null;
}

export interface UpdatePropertyTypeOptionRequest {
  name: string;
  description: string | null;
}
