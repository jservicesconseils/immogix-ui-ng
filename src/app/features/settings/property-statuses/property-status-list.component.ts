import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { AuthService } from '../../../core/auth/auth.service';
import { PropertyStatusOptionResponse } from '../../../core/models/property-status-option.model';
import { PropertyStatusOptionService } from '../../../core/services/property-status-option.service';

@Component({
  selector: 'app-property-status-list',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DialogModule, InputTextModule, TableModule, PrimeTemplate],
  templateUrl: './property-status-list.component.html',
  styleUrl: './property-status-list.component.scss',
})
export class PropertyStatusListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly propertyStatusOptionService = inject(PropertyStatusOptionService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly session = this.auth.session;
  readonly propertyStatuses = signal<PropertyStatusOptionResponse[]>([]);
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
    this.propertyStatusOptionService.listByOrganization(organizationId).subscribe({
      next: (propertyStatuses) => {
        this.propertyStatuses.set(propertyStatuses);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les statuts de propriété.' });
      },
    });
  }

  openCreateDialog(): void {
    this.editingId.set(null);
    this.form.reset();
    this.dialogVisible.set(true);
  }

  openEditDialog(propertyStatus: PropertyStatusOptionResponse): void {
    this.editingId.set(propertyStatus.id);
    this.form.setValue({ name: propertyStatus.name, description: propertyStatus.description });
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
      this.propertyStatusOptionService.update(editingId, { name: value.name, description: value.description }).subscribe({
        next: () => {
          this.submitting.set(false);
          this.dialogVisible.set(false);
          this.messageService.add({ severity: 'success', summary: 'Statut modifié', detail: 'Le statut de propriété a été modifié.' });
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

    this.propertyStatusOptionService.create({ organizationId, name: value.name, description: value.description }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.dialogVisible.set(false);
        this.messageService.add({ severity: 'success', summary: 'Statut créé', detail: 'Le statut de propriété a été ajouté.' });
        this.load();
      },
      error: () => {
        this.submitting.set(false);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'La création du statut de propriété a échoué.' });
      },
    });
  }

  confirmDelete(propertyStatus: PropertyStatusOptionResponse): void {
    this.confirmationService.confirm({
      header: 'Supprimer le statut de propriété',
      message: `Voulez-vous vraiment supprimer « ${propertyStatus.name} » ? Cette action est irréversible.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      acceptButtonStyleClass: 'p-button-danger',
      rejectLabel: 'Annuler',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.delete(propertyStatus),
    });
  }

  private delete(propertyStatus: PropertyStatusOptionResponse): void {
    this.propertyStatusOptionService.delete(propertyStatus.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Statut supprimé', detail: 'Le statut de propriété a été supprimé.' });
        this.load();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'La suppression a échoué.' });
      },
    });
  }
}
