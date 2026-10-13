import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreatePropertyStatusOptionRequest,
  PropertyStatusOptionResponse,
  UpdatePropertyStatusOptionRequest,
} from '../models/property-status-option.model';

@Injectable({ providedIn: 'root' })
export class PropertyStatusOptionService {
  private readonly http = inject(HttpClient);
  private readonly propertyStatusesUrl = `${environment.apiCoreUrl}/property-statuses`;

  create(request: CreatePropertyStatusOptionRequest): Observable<PropertyStatusOptionResponse> {
    return this.http.post<PropertyStatusOptionResponse>(this.propertyStatusesUrl, request);
  }

  getById(id: string): Observable<PropertyStatusOptionResponse> {
    return this.http.get<PropertyStatusOptionResponse>(`${this.propertyStatusesUrl}/${id}`);
  }

  listByOrganization(organizationId: string): Observable<PropertyStatusOptionResponse[]> {
    const params = new HttpParams().set('organizationId', organizationId);
    return this.http.get<PropertyStatusOptionResponse[]>(this.propertyStatusesUrl, { params });
  }

  update(id: string, request: UpdatePropertyStatusOptionRequest): Observable<PropertyStatusOptionResponse> {
    return this.http.put<PropertyStatusOptionResponse>(`${this.propertyStatusesUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.propertyStatusesUrl}/${id}`);
  }
}
