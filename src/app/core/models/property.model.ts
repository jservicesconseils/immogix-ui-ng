import { OptionRef, PropertyStatusRef } from './option-ref.model';

// Type/statut de propriete et type d'appartement sont desormais des
// listes configurables par organisation (voir Parametres), resolues en
// OptionRef/PropertyStatusRef par le backend -- plus des unions de string
// fixes. BuildingStatus et UnitStatus restent des enums fixes (hors
// scope de cette migration).
export type UnitStatus = 'DISPONIBLE' | 'OCCUPEE' | 'EN_MAINTENANCE';

export type BuildingStatus = 'NEUF' | 'RENOVE' | 'A_RENOVER';

export interface PropertyResponse {
  id: string;
  organizationId: string;
  propertyType: OptionRef;
  name: string | null;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  propertyStatus: PropertyStatusRef;
  cadastreNumber: string | null;
  taxId: string | null;
  buildingStatus: BuildingStatus | null;
  yearBuilt: number | null;
  floorCount: number | null;
  totalSurfaceArea: number | null;
  estimatedValue: number | null;
  description: string | null;
  createdAt: string;
}

export interface CreatePropertyRequest {
  organizationId: string;
  propertyTypeId: string;
  name: string | null;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  propertyStatusId: string;
  cadastreNumber: string | null;
  taxId: string | null;
  buildingStatus: BuildingStatus | null;
  yearBuilt: number | null;
  floorCount: number | null;
  totalSurfaceArea: number | null;
  estimatedValue: number | null;
  description: string | null;
}

export interface UpdatePropertyRequest {
  propertyTypeId: string;
  name: string | null;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  propertyStatusId: string;
  cadastreNumber: string | null;
  taxId: string | null;
  buildingStatus: BuildingStatus | null;
  yearBuilt: number | null;
  floorCount: number | null;
  totalSurfaceArea: number | null;
  estimatedValue: number | null;
  description: string | null;
}

export interface UnitResponse {
  id: string;
  propertyId: string;
  label: string;
  principal: boolean;
  floor: number | null;
  areaSquareMeters: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  apartmentType: OptionRef | null;
  description: string | null;
  listedRent: number | null;
  listedSecurityDeposit: number | null;
  status: UnitStatus;
  createdAt: string;
}

export interface CreateUnitRequest {
  label: string;
  principal: boolean;
  floor: number | null;
  areaSquareMeters: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  apartmentTypeId: string | null;
  description: string | null;
  listedRent: number | null;
  listedSecurityDeposit: number | null;
  status: UnitStatus | null;
}

export interface UpdateUnitRequest {
  label: string;
  floor: number | null;
  areaSquareMeters: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  apartmentTypeId: string | null;
  description: string | null;
  listedRent: number | null;
  listedSecurityDeposit: number | null;
}

/**
 * Vue publique minimale d'une unite (annonce), consultable sans jeton
 * par un candidat avant qu'il postule -- voir
 * PropertyController.getUnitListing cote backend.
 */
export interface UnitListingResponse {
  propertyId: string;
  unitId: string;
  unitLabel: string;
  apartmentType: OptionRef | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSquareMeters: number | null;
  listedRent: number | null;
  propertyStreet: string;
  propertyCity: string;
  propertyProvince: string;
  status: UnitStatus;
}

export const UNIT_STATUS_LABELS: Record<string, string> = {
  DISPONIBLE: 'Disponible',
  OCCUPEE: 'Occupé',
  EN_MAINTENANCE: 'En rénovation',
};

export const UNIT_STATUS_SEVERITY: Record<string, 'success' | 'warn' | 'info'> = {
  DISPONIBLE: 'warn',
  OCCUPEE: 'success',
  EN_MAINTENANCE: 'info',
};

export const BUILDING_STATUS_LABELS: Record<string, string> = {
  NEUF: 'Neuf',
  RENOVE: 'Rénové',
  A_RENOVER: 'À rénover',
};
