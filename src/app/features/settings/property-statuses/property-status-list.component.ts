import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { AuthService } from '../../../core/auth/auth.service';
import { StatusSeverity } from '../../../core/models/option-ref.model';
import { PropertyStatusOptionResponse } from '../../../core/models/property-status-option.model';
import { PropertyStatusOptionService } from '../../../core/services/property-status-option.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-property-status-list',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule, TableModule, TagModule, PrimeTemplate, TranslatePipe],
  templateUrl: './property-status-list.component.html',
  styleUrl: './property-status-list.component.scss',
})
export class PropertyStatusListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly propertyStatusOptionService = inject(PropertyStatusOptionService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  readonly i18n = inject(I18nService);

  readonly session = this.auth.session;
  readonly propertyStatuses = signal<PropertyStatusOptionResponse[]>([]);
  readonly loading = signal(true);
  readonly dialogVisible = signal(false);
  readonly submitting = signal(false);
  readonly editingId = signal<string | null>(null);

  readonly severityOptions = computed<{ label: string; value: StatusSeverity }[]>(() => [
    { label: this.i18n.translate('settings.severity.success'), value: 'success' },
    { label: this.i18n.translate('settings.severity.warn'), value: 'warn' },
    { label: this.i18n.translate('settings.severity.danger'), value: 'danger' },
    { label: this.i18n.translate('settings.severity.info'), value: 'info' },
    { label: this.i18n.translate('settings.severity.secondary'), value: 'secondary' },
  ]);

  readonly form = this.fb.nonNullable.group({
    nameEn: ['', [Validators.required, Validators.maxLength(100)]],
    nameFr: ['', [Validators.required, Validators.maxLength(100)]],
    description: this.fb.control<string | null>(null, Validators.maxLength(300)),
    severity: this.fb.nonNullable.control<StatusSeverity>('info', Validators.required),
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
        this.messageService.add({ severity: 'error', summary: this.i18n.translate('common.errorTitle'), detail: this.i18n.translate('settings.propertyStatuses.title') });
      },
    });
  }

  openCreateDialog(): void {
    this.editingId.set(null);
    this.form.reset({ nameEn: '', nameFr: '', description: null, severity: 'info' });
    this.dialogVisible.set(true);
  }

  openEditDialog(propertyStatus: PropertyStatusOptionResponse): void {
    this.editingId.set(propertyStatus.id);
    this.form.setValue({
      nameEn: propertyStatus.nameEn,
      nameFr: propertyStatus.nameFr,
      description: propertyStatus.description,
      severity: propertyStatus.severity,
    });
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
      this.propertyStatusOptionService
        .update(editingId, { nameEn: value.nameEn, nameFr: value.nameFr, description: value.description, severity: value.severity })
        .subscribe({
          next: () => {
            this.submitting.set(false);
            this.dialogVisible.set(false);
            this.messageService.add({ severity: 'success', summary: this.i18n.translate('common.save'), detail: this.i18n.translate('settings.propertyStatuses.updatedToast') });
            this.load();
          },
          error: () => {
            this.submitting.set(false);
            this.messageService.add({ severity: 'error', summary: this.i18n.translate('common.errorTitle'), detail: this.i18n.translate('settings.propertyStatuses.updatedToast') });
          },
        });
      return;
    }

    const organizationId = this.session()?.organizationId;
    if (!organizationId) {
      this.submitting.set(false);
      return;
    }

    this.propertyStatusOptionService
      .create({ organizationId, nameEn: value.nameEn, nameFr: value.nameFr, description: value.description, severity: value.severity })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.dialogVisible.set(false);
          this.messageService.add({ severity: 'success', summary: this.i18n.translate('common.create'), detail: this.i18n.translate('settings.propertyStatuses.createdToast') });
          this.load();
        },
        error: () => {
          this.submitting.set(false);
          this.messageService.add({ severity: 'error', summary: this.i18n.translate('common.errorTitle'), detail: this.i18n.translate('settings.propertyStatuses.createdToast') });
        },
      });
  }

  confirmDelete(propertyStatus: PropertyStatusOptionResponse): void {
    this.confirmationService.confirm({
      header: this.i18n.translate('settings.propertyStatuses.deleteTitle'),
      message: this.i18n.translate('settings.deleteConfirm.message', { name: this.i18n.optionName(propertyStatus) }),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.i18n.translate('common.delete'),
      acceptButtonStyleClass: 'p-button-danger',
      rejectLabel: this.i18n.translate('common.cancel'),
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.delete(propertyStatus),
    });
  }

  private delete(propertyStatus: PropertyStatusOptionResponse): void {
    this.propertyStatusOptionService.delete(propertyStatus.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: this.i18n.translate('common.delete'), detail: this.i18n.translate('settings.propertyStatuses.deletedToast') });
        this.load();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: this.i18n.translate('common.errorTitle'), detail: this.i18n.translate('settings.propertyStatuses.deletedToast') });
      },
    });
  }
}
