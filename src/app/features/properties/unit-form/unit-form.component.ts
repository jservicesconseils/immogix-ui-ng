import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../../core/auth/auth.service';
import { PropertyResponse, UNIT_STATUS_LABELS, UnitStatus } from '../../../core/models/property.model';
import { ApartmentTypeResponse } from '../../../core/models/apartment-type.model';
import { PropertyService } from '../../../core/services/property.service';
import { ApartmentTypeService } from '../../../core/services/apartment-type.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

/**
 * Ajout ET edition d'un appartement (ecran "Ajout d'un appartement" de la
 * maquette), meme formulaire pour les deux cas -- seule la source des
 * valeurs initiales et l'appel de service different.
 *
 * Le type d'appartement est charge depuis Parametres (ApartmentTypeService)
 * plutot que code en dur -- voir settings/apartment-types.
 */
@Component({
  selector: 'app-unit-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputNumberModule, InputTextModule, SelectModule, TextareaModule, TranslatePipe],
  templateUrl: './unit-form.component.html',
  styleUrl: './unit-form.component.scss',
})
export class UnitFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly propertyService = inject(PropertyService);
  private readonly apartmentTypeService = inject(ApartmentTypeService);
  private readonly messageService = inject(MessageService);
  readonly i18n = inject(I18nService);

  readonly propertyId = this.route.snapshot.paramMap.get('propertyId')!;
  readonly unitId = this.route.snapshot.paramMap.get('unitId');
  readonly mode = computed<'create' | 'edit'>(() => (this.unitId ? 'edit' : 'create'));

  readonly property = signal<PropertyResponse | null>(null);
  readonly loading = signal(!!this.unitId);
  readonly submitting = signal(false);

  private readonly apartmentTypesRaw = signal<ApartmentTypeResponse[]>([]);
  readonly apartmentTypeOptions = computed(() =>
    this.apartmentTypesRaw().map((option) => ({ label: this.i18n.optionName(option), value: option.id })),
  );
  readonly statusOptions = Object.entries(UNIT_STATUS_LABELS).map(([value, label]) => ({ label, value }));

  readonly form = this.fb.nonNullable.group({
    label: ['', [Validators.required, Validators.maxLength(50)]],
    floor: this.fb.control<number | null>(null),
    apartmentTypeId: this.fb.control<string | null>(null),
    bedrooms: this.fb.control<number | null>(null),
    bathrooms: this.fb.control<number | null>(null),
    areaSquareMeters: this.fb.control<number | null>(null),
    listedRent: this.fb.control<number | null>(null),
    listedSecurityDeposit: this.fb.control<number | null>(null),
    status: this.fb.control<UnitStatus | null>('DISPONIBLE'),
    description: this.fb.control<string | null>(null, Validators.maxLength(2000)),
  });

  constructor() {
    this.propertyService.getById(this.propertyId).subscribe((property) => this.property.set(property));

    const organizationId = this.auth.session()?.organizationId;
    if (organizationId) {
      this.apartmentTypeService.listByOrganization(organizationId).subscribe((options) => this.apartmentTypesRaw.set(options));
    }

    if (this.unitId) {
      this.propertyService.getUnit(this.propertyId, this.unitId).subscribe({
        next: (unit) => {
          this.form.patchValue({
            label: unit.label,
            floor: unit.floor,
            apartmentTypeId: unit.apartmentType?.id ?? null,
            bedrooms: unit.bedrooms,
            bathrooms: unit.bathrooms,
            areaSquareMeters: unit.areaSquareMeters,
            listedRent: unit.listedRent,
            listedSecurityDeposit: unit.listedSecurityDeposit,
            status: unit.status,
            description: unit.description,
          });
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Appartement introuvable.' });
        },
      });
    }
  }

  addPhotos(): void {
    this.messageService.add({ severity: 'info', summary: 'Bientôt disponible', detail: "L'envoi de photos sera ajouté prochainement." });
  }

  cancel(): void {
    if (this.unitId) {
      this.router.navigate(['/properties', this.propertyId, 'units', this.unitId]);
    } else {
      this.router.navigate(['/properties', this.propertyId]);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const value = this.form.getRawValue();

    if (this.mode() === 'edit' && this.unitId) {
      this.propertyService
        .updateUnit(this.propertyId, this.unitId, {
          label: value.label,
          floor: value.floor,
          areaSquareMeters: value.areaSquareMeters,
          bedrooms: value.bedrooms,
          bathrooms: value.bathrooms,
          apartmentTypeId: value.apartmentTypeId,
          description: value.description,
          listedRent: value.listedRent,
          listedSecurityDeposit: value.listedSecurityDeposit,
        })
        .subscribe({
          next: () => {
            this.submitting.set(false);
            this.messageService.add({ severity: 'success', summary: 'Appartement modifié' });
            this.router.navigate(['/properties', this.propertyId, 'units', this.unitId]);
          },
          error: () => {
            this.submitting.set(false);
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'La modification a échoué.' });
          },
        });
      return;
    }

    this.propertyService
      .createUnit(this.propertyId, {
        label: value.label,
        principal: false,
        floor: value.floor,
        areaSquareMeters: value.areaSquareMeters,
        bedrooms: value.bedrooms,
        bathrooms: value.bathrooms,
        apartmentTypeId: value.apartmentTypeId,
        description: value.description,
        listedRent: value.listedRent,
        listedSecurityDeposit: value.listedSecurityDeposit,
        status: value.status,
      })
      .subscribe({
        next: (created) => {
          this.submitting.set(false);
          this.messageService.add({ severity: 'success', summary: 'Appartement ajouté' });
          this.router.navigate(['/properties', this.propertyId, 'units', created.id]);
        },
        error: () => {
          this.submitting.set(false);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "L'ajout de l'appartement a échoué." });
        },
      });
  }
}
