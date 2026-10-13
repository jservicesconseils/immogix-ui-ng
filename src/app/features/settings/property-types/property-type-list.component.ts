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
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-property-type-list',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DialogModule, InputTextModule, TableModule, PrimeTemplate, TranslatePipe],
  templateUrl: './property-type-list.component.html',
  styleUrl: './property-type-list.component.scss',
})
export class PropertyTypeListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly propertyTypeOptionService = inject(PropertyTypeOptionService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  readonly i18n = inject(I18nService);

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
        this.messageService.add({ severity: 'error', summary: this.i18n.translate('common.errorTitle'), detail: this.i18n.translate('settings.propertyTypes.title') });
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
          this.messageService.add({ severity: 'success', summary: this.i18n.translate('common.save'), detail: this.i18n.translate('settings.propertyTypes.updatedToast') });
          this.load();
        },
        error: () => {
          this.submitting.set(false);
          this.messageService.add({ severity: 'error', summary: this.i18n.translate('common.errorTitle'), detail: this.i18n.translate('settings.propertyTypes.updatedToast') });
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
        this.messageService.add({ severity: 'success', summary: this.i18n.translate('common.create'), detail: this.i18n.translate('settings.propertyTypes.createdToast') });
        this.load();
      },
      error: () => {
        this.submitting.set(false);
        this.messageService.add({ severity: 'error', summary: this.i18n.translate('common.errorTitle'), detail: this.i18n.translate('settings.propertyTypes.createdToast') });
      },
    });
  }

  confirmDelete(propertyType: PropertyTypeOptionResponse): void {
    this.confirmationService.confirm({
      header: this.i18n.translate('settings.propertyTypes.deleteTitle'),
      message: this.i18n.translate('settings.deleteConfirm.message', { name: this.i18n.optionName(propertyType) }),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.i18n.translate('common.delete'),
      acceptButtonStyleClass: 'p-button-danger',
      rejectLabel: this.i18n.translate('common.cancel'),
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.delete(propertyType),
    });
  }

  private delete(propertyType: PropertyTypeOptionResponse): void {
    this.propertyTypeOptionService.delete(propertyType.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: this.i18n.translate('common.delete'), detail: this.i18n.translate('settings.propertyTypes.deletedToast') });
        this.load();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: this.i18n.translate('common.errorTitle'), detail: this.i18n.translate('settings.propertyTypes.deletedToast') });
      },
    });
  }
}
