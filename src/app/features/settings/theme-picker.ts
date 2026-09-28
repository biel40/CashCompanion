import { Component, computed, inject } from '@angular/core';
import { ThemePreference } from '../../core/models/settings';
import { ThemeService } from '../../core/ui-state/theme.service';
import { Icon } from '../../shared/ui/icon/icon';
import { IconName } from '../../shared/ui/icon/icons';

interface ThemeOption {
  readonly value: ThemePreference;
  readonly label: string;
  readonly icon: IconName;
}

const OPTIONS: readonly ThemeOption[] = [
  { value: 'system', label: 'Sistema', icon: 'device' },
  { value: 'light', label: 'Claro', icon: 'sun' },
  { value: 'dark', label: 'Oscuro', icon: 'moon' },
];

@Component({
  selector: 'app-theme-picker',
  imports: [Icon],
  template: `
    <fieldset class="group">
      <legend class="section-title">Apariencia</legend>
      <div class="segmented" [style.--active]="activeIndex()">
        <span class="thumb" aria-hidden="true"></span>
        @for (option of options; track option.value) {
          <label class="option pressable">
            <input
              class="visually-hidden"
              type="radio"
              name="theme"
              [value]="option.value"
              [checked]="theme.preference() === option.value"
              (change)="theme.setPreference(option.value)"
            />
            <app-icon [name]="option.icon" [size]="20" />
            <span>{{ option.label }}</span>
          </label>
        }
      </div>
    </fieldset>
  `,
  host: { class: 'card' },
  styles: `
    .group {
      margin: 0;
      padding: 0;
      border: 0;
    }
    legend {
      margin-bottom: var(--space-4);
      padding: 0;
    }
    .segmented {
      position: relative;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      padding: var(--space-1);
      border-radius: var(--radius-row);
      background: var(--surface-2);
    }
    .thumb {
      position: absolute;
      inset: var(--space-1) auto var(--space-1) var(--space-1);
      width: calc((100% - var(--space-2)) / 3);
      border-radius: calc(var(--radius-row) - var(--space-1));
      background: var(--surface);
      box-shadow: 0 1px 3px rgb(17 18 24 / 0.12);
      transform: translateX(calc(var(--active) * 100%));
      transition: transform 420ms var(--ease-spring);
    }
    .option {
      position: relative;
      display: grid;
      justify-items: center;
      gap: var(--space-1);
      padding: var(--space-3) var(--space-2);
      border-radius: calc(var(--radius-row) - var(--space-1));
      color: var(--text-muted);
      font-size: var(--text-caption);
      font-weight: var(--weight-semibold);
      cursor: pointer;
      transition: color var(--duration-micro) ease;
    }
    .option:has(input:checked) {
      color: var(--text);
    }
    .option:has(input:focus-visible) {
      outline: 2.5px solid var(--focus-ring);
      outline-offset: 2px;
    }
  `,
})
export class ThemePicker {
  protected readonly theme = inject(ThemeService);
  protected readonly options = OPTIONS;
  protected readonly activeIndex = computed(() =>
    OPTIONS.findIndex((option) => option.value === this.theme.preference()),
  );
}
