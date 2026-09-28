import { Component, computed, inject, input } from '@angular/core';
import { MoneyFormatter } from '../../../core/format/money-formatter';
import { Icon } from '../icon/icon';

/** "+8 % vs. agosto". More spending reads warm, less spending reads green. */
@Component({
  selector: 'app-change-badge',
  imports: [Icon],
  template: `
    <app-icon [name]="increased() ? 'trend-up' : 'trend-down'" [size]="15" [strokeWidth]="2.4" />
    <span class="tabular">{{ percent() }}</span>
    @if (suffix(); as suffix) {
      <span class="suffix">{{ suffix }}</span>
    }
  `,
  host: {
    '[class.up]': 'increased()',
    '[class.down]': '!increased()',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.3rem 0.65rem 0.3rem 0.5rem;
      border-radius: var(--radius-pill);
      background: var(--badge-bg, var(--surface-2));
      font-size: var(--text-caption);
      font-weight: var(--weight-semibold);
    }
    :host(.up) {
      color: var(--badge-up, var(--up));
    }
    :host(.down) {
      color: var(--badge-down, var(--down));
    }
    .suffix {
      color: var(--badge-muted, var(--text-muted));
      font-weight: var(--weight-medium);
    }
  `,
})
export class ChangeBadge {
  private readonly _formatter = inject(MoneyFormatter);

  /** Relative change, e.g. 0.08 for +8 %. */
  public readonly change = input.required<number>();
  public readonly suffix = input<string>();

  protected readonly increased = computed(() => this.change() >= 0);
  protected readonly percent = computed(() => this._formatter.percentChange(this.change()));
}
