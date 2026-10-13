// Nomme "Option" pour ne pas entrer en collision avec OptionRef (deja
// utilise par Property.propertyType) -- ce fichier-ci modelise les
// reponses du CRUD de Parametres (avec organizationId/createdAt), OptionRef
// est la forme legere embarquee dans PropertyResponse.
export interface PropertyTypeOptionResponse {
  id: string;
  organizationId: string;
  nameEn: string;
  nameFr: string;
  description: string | null;
  createdAt: string;
}

export interface CreatePropertyTypeOptionRequest {
  organizationId: string;
  nameEn: string;
  nameFr: string;
  description: string | null;
}

export interface UpdatePropertyTypeOptionRequest {
  nameEn: string;
  nameFr: string;
  description: string | null;
}
