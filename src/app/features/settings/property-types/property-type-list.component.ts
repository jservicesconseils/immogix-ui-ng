import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { AuthService } from '../../../core/auth/auth.service';
import { PropertyTypeOptionResponse } from '../../../core/models/property-type-option.model';
import { PropertyTypeOptionService } from '../../../core/services/property-type-option.service';

@Component({
  selector: 'app-property-type-list',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DialogModule, InputTextModule, TableModule, PrimeTemplate],
  templateUrl: './property-type-list.component.html',
  styleUrl: './property-type-list.component.scss',
})
export class PropertyTypeListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly propertyTypeOptionService = inject(PropertyTypeOptionService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly session = this.auth.session;
  readonly propertyTypes = signal<PropertyTypeOptionResponse[]>([]);
  readonly loading = signal(true);
  readonly dialogVisible = signal(false);
  readonly submitting = signal(false);
  readonly editingId = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: this.fb.control<string | null>(null, Validators.maxLength(300)),
  });

  constructor() {
    this.load();
  }

  load(): void {
    const organizationId = this.session()?.organizationId;
    if (!organizationId) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.propertyTypeOptionService.listByOrganization(organizationId).subscribe({
      next: (propertyTypes) => {
        this.propertyTypes.set(propertyTypes);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les types de propriété.' });
      },
    });
  }

  openCreateDialog(): void {
    this.editingId.set(null);
    this.form.reset();
    this.dialogVisible.set(true);
  }

  openEditDialog(propertyType: PropertyTypeOptionResponse): void {
    this.editingId.set(propertyType.id);
    this.form.setValue({ name: propertyType.name, description: propertyType.description });
    this.dialogVisible.set(true);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const editingId = this.editingId();
    this.submitting.set(true);

    if (editingId) {
      this.propertyTypeOptionService.update(editingId, { name: value.name, description: value.description }).subscribe({
        next: () => {
          this.submitting.set(false);
          this.dialogVisible.set(false);
          this.messageService.add({ severity: 'success', summary: 'Type modifié', detail: 'Le type de propriété a été modifié.' });
          this.load();
        },
        error: () => {
          this.submitting.set(false);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'La modification a échoué.' });
        },
      });
      return;
    }

    const organizationId = this.session()?.organizationId;
    if (!organizationId) {
      this.submitting.set(false);
      return;
    }

    this.propertyTypeOptionService.create({ organizationId, name: value.name, description: value.description }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.dialogVisible.set(false);
        this.messageService.add({ severity: 'success', summary: 'Type créé', detail: 'Le type de propriété a été ajouté.' });
        this.load();
      },
      error: () => {
        this.submitting.set(false);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'La création du type de propriété a échoué.' });
      },
    });
  }

  confirmDelete(propertyType: PropertyTypeOptionResponse): void {
    this.confirmationService.confirm({
      header: 'Supprimer le type de propriété',
      message: `Voulez-vous vraiment supprimer « ${propertyType.name} » ? Cette action est irréversible.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      acceptButtonStyleClass: 'p-button-danger',
      rejectLabel: 'Annuler',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.delete(propertyType),
    });
  }

  private delete(propertyType: PropertyTypeOptionResponse): void {
    this.propertyTypeOptionService.delete(propertyType.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Type supprimé', detail: 'Le type de propriété a été supprimé.' });
        this.load();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'La suppression a échoué.' });
      },
    });
  }
}
