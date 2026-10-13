import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './settings-home.component.html',
  styleUrl: './settings-home.component.scss',
})
export class SettingsHomeComponent {
  readonly sections = [
    {
      route: 'types-appartement',
      icon: 'pi pi-home',
      title: "Types d'appartement",
      description: "Vocabulaire utilisé pour décrire vos unités (ex. studio, 3½, 4½).",
    },
    {
      route: 'types-propriete',
      icon: 'pi pi-building',
      title: 'Types de propriété',
      description: 'Catégories utilisées pour classer vos propriétés (ex. résidentiel, commercial).',
    },
    {
      route: 'statuts-propriete',
      icon: 'pi pi-tag',
      title: 'Statuts de propriété',
      description: 'États possibles pour une propriété (ex. actif, en rénovation, vendu).',
    },
  ];
}
