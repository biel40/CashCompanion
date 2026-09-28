import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../../core/ui-state/theme.service';
import { Icon } from '../icon/icon';

/** One-tap switch between light and dark. The full picker (with "Sistema") lives in the profile and Settings. */
@Component({
  selector: 'app-theme-toggle',
  imports: [Icon],
  template: `
    <button
      type="button"
      class="toggle pressable"
      [attr.aria-label]="label()"
      (click)="theme.toggle()"
    >
      @if (isDark()) {
        <app-icon class="swap" name="sun" animate.enter="swap-in" />
      } @else {
        <app-icon class="swap" name="moon" animate.enter="swap-in" />
      }
    </button>
  `,
  styles: `
    .toggle {
      display: grid;
      place-items: center;
      width: var(--tap-target);
      height: var(--tap-target);
      border: 0;
      border-radius: 50%;
      background: var(--surface);
      color: var(--text);
      box-shadow: var(--shadow-card);
    }
    .swap {
      grid-area: 1 / 1;
    }
    .swap-in {
      animation: swap-in 420ms var(--ease-spring);
    }
    @keyframes swap-in {
      from {
        opacity: 0;
        transform: rotate(-90deg) scale(0.5);
      }
    }
    @media (hover: hover) {
      .toggle:hover {
        background: var(--surface-2);
      }
    }
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
  protected readonly isDark = computed(() => this.theme.resolved() === 'dark');
  protected readonly label = computed(() =>
    this.isDark() ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro',
  );
}
