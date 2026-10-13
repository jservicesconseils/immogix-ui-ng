import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-settings-home',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './settings-home.component.html',
  styleUrl: './settings-home.component.scss',
})
export class SettingsHomeComponent {
  readonly sections = [
    {
      route: 'apartment-types',
      icon: 'pi pi-home',
      titleKey: 'settings.apartmentTypes.title',
      descriptionKey: 'settings.apartmentTypes.subtitle',
    },
    {
      route: 'property-types',
      icon: 'pi pi-building',
      titleKey: 'settings.propertyTypes.title',
      descriptionKey: 'settings.propertyTypes.subtitle',
    },
    {
      route: 'property-statuses',
      icon: 'pi pi-tag',
      titleKey: 'settings.propertyStatuses.title',
      descriptionKey: 'settings.propertyStatuses.subtitle',
    },
  ];
}
