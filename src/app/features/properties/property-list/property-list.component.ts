import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';
import { PropertyResponse, UnitResponse } from '../../../core/models/property.model';
import { PropertyTypeOptionResponse } from '../../../core/models/property-type-option.model';
import { PropertyStatusOptionResponse } from '../../../core/models/property-status-option.model';
import { PropertyService } from '../../../core/services/property.service';
import { PropertyTypeOptionService } from '../../../core/services/property-type-option.service';
import { PropertyStatusOptionService } from '../../../core/services/property-status-option.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

interface PropertyRow {
  property: PropertyResponse;
  unitCount: number;
  occupancyRate: number | null;
  monthlyRevenue: number;
}

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, SelectModule, TableModule, TagModule, CurrencyPipe, PrimeTemplate, TranslatePipe],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.scss',
})
export class PropertyListComponent {
  private readonly auth = inject(AuthService);
  private readonly propertyService = inject(PropertyService);
  private readonly propertyTypeOptionService = inject(PropertyTypeOptionService);
  private readonly propertyStatusOptionService = inject(PropertyStatusOptionService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  readonly session = this.auth.session;
  readonly rows = signal<PropertyRow[]>([]);
  readonly loading = signal(true);

  readonly searchTerm = signal('');
  readonly typeFilter = signal<string | null>(null);
  readonly statusFilter = signal<string | null>(null);
  readonly cityFilter = signal<string | null>(null);

  private readonly propertyTypesRaw = signal<PropertyTypeOptionResponse[]>([]);
  private readonly propertyStatusesRaw = signal<PropertyStatusOptionResponse[]>([]);
  readonly typeOptions = computed(() =>
    this.propertyTypesRaw().map((option) => ({ label: this.i18n.optionName(option), value: option.id })),
  );
  readonly statusOptions = computed(() =>
    this.propertyStatusesRaw().map((option) => ({ label: this.i18n.optionName(option), value: option.id })),
  );

  readonly cityOptions = computed(() => {
    const cities = new Set(this.rows().map((row) => row.property.city));
    return [...cities].sort().map((city) => ({ label: city, value: city }));
  });

  readonly filteredRows = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const type = this.typeFilter();
    const status = this.statusFilter();
    const city = this.cityFilter();
    return this.rows().filter((row) => {
      const matchesTerm = !term || row.property.street.toLowerCase().includes(term) || (row.property.name ?? '').toLowerCase().includes(term);
      const matchesType = !type || row.property.propertyType.id === type;
      const matchesStatus = !status || row.property.propertyStatus.id === status;
      const matchesCity = !city || row.property.city === city;
      return matchesTerm && matchesType && matchesStatus && matchesCity;
    });
  });

  constructor() {
    this.load();

    const organizationId = this.session()?.organizationId;
    if (organizationId) {
      this.propertyTypeOptionService.listByOrganization(organizationId).subscribe((options) => this.propertyTypesRaw.set(options));
      this.propertyStatusOptionService.listByOrganization(organizationId).subscribe((options) => this.propertyStatusesRaw.set(options));
    }
  }

  load(): void {
    const organizationId = this.session()?.organizationId;
    if (!organizationId) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.propertyService.listByOrganization(organizationId).subscribe({
      next: (properties) => {
        if (!properties.length) {
          this.rows.set([]);
          this.loading.set(false);
          return;
        }
        // Pas d'endpoint agregeant appartements/occupation/revenu par
        // propriete (hors scope du MVP) -- on calcule cote client a
        // partir des unites de chaque propriete, acceptable pour un
        // portefeuille de cette taille.
        forkJoin(
          properties.map((property) =>
            this.propertyService.listUnits(property.id).pipe(catchError(() => of<UnitResponse[]>([])))
          )
        ).subscribe((unitsByProperty) => {
          this.rows.set(
            properties.map((property, index) => this.toRow(property, unitsByProperty[index]))
          );
          this.loading.set(false);
        });
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les propriétés.' });
      },
    });
  }

  private toRow(property: PropertyResponse, units: UnitResponse[]): PropertyRow {
    const occupied = units.filter((unit) => unit.status === 'OCCUPEE');
    const occupancyRate = units.length ? Math.round((occupied.length / units.length) * 100) : null;
    const monthlyRevenue = occupied.reduce((sum, unit) => sum + (unit.listedRent ?? 0), 0);
    return { property, unitCount: units.length, occupancyRate, monthlyRevenue };
  }

  newProperty(): void {
    this.router.navigate(['/properties/new']);
  }

  openProperty(row: PropertyRow): void {
    this.router.navigate(['/properties', row.property.id]);
  }
}
