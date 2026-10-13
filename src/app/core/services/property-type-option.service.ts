import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreatePropertyTypeOptionRequest,
  PropertyTypeOptionResponse,
  UpdatePropertyTypeOptionRequest,
} from '../models/property-type-option.model';

@Injectable({ providedIn: 'root' })
export class PropertyTypeOptionService {
  private readonly http = inject(HttpClient);
  private readonly propertyTypesUrl = `${environment.apiCoreUrl}/property-types`;

  create(request: CreatePropertyTypeOptionRequest): Observable<PropertyTypeOptionResponse> {
    return this.http.post<PropertyTypeOptionResponse>(this.propertyTypesUrl, request);
  }

  getById(id: string): Observable<PropertyTypeOptionResponse> {
    return this.http.get<PropertyTypeOptionResponse>(`${this.propertyTypesUrl}/${id}`);
  }

  listByOrganization(organizationId: string): Observable<PropertyTypeOptionResponse[]> {
    const params = new HttpParams().set('organizationId', organizationId);
    return this.http.get<PropertyTypeOptionResponse[]>(this.propertyTypesUrl, { params });
  }

  update(id: string, request: UpdatePropertyTypeOptionRequest): Observable<PropertyTypeOptionResponse> {
    return this.http.put<PropertyTypeOptionResponse>(`${this.propertyTypesUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.propertyTypesUrl}/${id}`);
  }
}
