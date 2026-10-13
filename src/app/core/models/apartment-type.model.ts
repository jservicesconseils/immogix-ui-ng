export interface ApartmentTypeResponse {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface CreateApartmentTypeRequest {
  organizationId: string;
  name: string;
  description: string | null;
}

export interface UpdateApartmentTypeRequest {
  name: string;
  description: string | null;
}
