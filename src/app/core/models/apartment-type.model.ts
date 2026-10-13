export interface ApartmentTypeResponse {
  id: string;
  organizationId: string;
  nameEn: string;
  nameFr: string;
  description: string | null;
  createdAt: string;
}

export interface CreateApartmentTypeRequest {
  organizationId: string;
  nameEn: string;
  nameFr: string;
  description: string | null;
}

export interface UpdateApartmentTypeRequest {
  nameEn: string;
  nameFr: string;
  description: string | null;
}
