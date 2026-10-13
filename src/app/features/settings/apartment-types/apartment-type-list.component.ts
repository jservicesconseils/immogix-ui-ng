import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { AuthService } from '../../../core/auth/auth.service';
import { ApartmentTypeResponse } from '../../../core/models/apartment-type.model';
import { ApartmentTypeService } from '../../../core/services/apartment-type.service';

@Component({
  selector: 'app-apartment-type-list',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DialogModule, InputTextModule, TableModule, PrimeTemplate],
  templateUrl: './apartment-type-list.component.html',
  styleUrl: './apartment-type-list.component.scss',
})
export class ApartmentTypeListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly apartmentTypeService = inject(ApartmentTypeService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly session = this.auth.session;
  readonly apartmentTypes = signal<ApartmentTypeResponse[]>([]);
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
    this.apartmentTypeService.listByOrganization(organizationId).subscribe({
      next: (apartmentTypes) => {
        this.apartmentTypes.set(apartmentTypes);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Impossible de charger les types d'appartement." });
      },
    });
  }

  openCreateDialog(): void {
    this.editingId.set(null);
    this.form.reset();
    this.dialogVisible.set(true);
  }

  openEditDialog(apartmentType: ApartmentTypeResponse): void {
    this.editingId.set(apartmentType.id);
    this.form.setValue({ name: apartmentType.name, description: apartmentType.description });
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
      this.apartmentTypeService.update(editingId, { name: value.name, description: value.description }).subscribe({
        next: () => {
          this.submitting.set(false);
          this.dialogVisible.set(false);
          this.messageService.add({ severity: 'success', summary: 'Type modifié', detail: "Le type d'appartement a été modifié." });
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

    this.apartmentTypeService.create({ organizationId, name: value.name, description: value.description }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.dialogVisible.set(false);
        this.messageService.add({ severity: 'success', summary: 'Type créé', detail: "Le type d'appartement a été ajouté." });
        this.load();
      },
      error: () => {
        this.submitting.set(false);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "La création du type d'appartement a échoué." });
      },
    });
  }

  confirmDelete(apartmentType: ApartmentTypeResponse): void {
    this.confirmationService.confirm({
      header: "Supprimer le type d'appartement",
      message: `Voulez-vous vraiment supprimer « ${apartmentType.name} » ? Cette action est irréversible.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      acceptButtonStyleClass: 'p-button-danger',
      rejectLabel: 'Annuler',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.delete(apartmentType),
    });
  }

  private delete(apartmentType: ApartmentTypeResponse): void {
    this.apartmentTypeService.delete(apartmentType.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Type supprimé', detail: "Le type d'appartement a été supprimé." });
        this.load();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'La suppression a échoué.' });
      },
    });
  }
}
