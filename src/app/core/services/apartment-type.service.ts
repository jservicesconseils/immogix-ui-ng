import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApartmentTypeResponse, CreateApartmentTypeRequest, UpdateApartmentTypeRequest } from '../models/apartment-type.model';

@Injectable({ providedIn: 'root' })
export class ApartmentTypeService {
  private readonly http = inject(HttpClient);
  private readonly apartmentTypesUrl = `${environment.apiCoreUrl}/apartment-types`;

  create(request: CreateApartmentTypeRequest): Observable<ApartmentTypeResponse> {
    return this.http.post<ApartmentTypeResponse>(this.apartmentTypesUrl, request);
  }

  getById(id: string): Observable<ApartmentTypeResponse> {
    return this.http.get<ApartmentTypeResponse>(`${this.apartmentTypesUrl}/${id}`);
  }

  listByOrganization(organizationId: string): Observable<ApartmentTypeResponse[]> {
    const params = new HttpParams().set('organizationId', organizationId);
    return this.http.get<ApartmentTypeResponse[]>(this.apartmentTypesUrl, { params });
  }

  update(id: string, request: UpdateApartmentTypeRequest): Observable<ApartmentTypeResponse> {
    return this.http.put<ApartmentTypeResponse>(`${this.apartmentTypesUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apartmentTypesUrl}/${id}`);
  }
}
