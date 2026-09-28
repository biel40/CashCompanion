import { Component } from '@angular/core';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { ThemePicker } from './theme-picker';

@Component({
  selector: 'app-settings-page',
  imports: [PageHeader, ThemePicker],
  template: `
    <div class="stagger">
      <app-page-header style="--i: 0" title="Ajustes" />
      <app-theme-picker style="--i: 1" />
    </div>
  `,
  styles: `
    .stagger {
      display: grid;
      gap: var(--space-4);
    }
  `,
})
export class SettingsPage {}
