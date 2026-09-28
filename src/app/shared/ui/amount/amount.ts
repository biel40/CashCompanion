import {
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { MoneyFormatter } from '../../../core/format/money-formatter';
import { CurrencyCode } from '../../../core/models/money';

const TWEEN_MS = 650;

/**
 * Money amount with a large integer part and smaller decimals and symbol.
 * Counts towards new values; screen readers only get the final value.
 */
@Component({
  selector: 'app-amount',
  template: `
    <span class="visually-hidden">{{ label() }}</span>
    <span class="value tabular" aria-hidden="true">
      @for (part of parts(); track $index) {
        <span [class]="part.kind">{{ part.text }}</span>
      }
    </span>
  `,
  styles: `
    :host {
      display: inline-block;
      white-space: nowrap;
    }
    .value {
      display: inline-flex;
      align-items: baseline;
    }
    .minor,
    .currency {
      font-size: 0.5em;
      font-weight: var(--weight-semibold);
      letter-spacing: 0;
    }
    .currency {
      white-space: pre;
    }
  `,
})
export class Amount {
  private readonly _formatter = inject(MoneyFormatter);
  private readonly _window = inject(DOCUMENT).defaultView;
  private readonly _displayed = signal(0);
  private _frame = 0;

  public readonly value = input.required<number>();
  public readonly currency = input.required<CurrencyCode>();

  protected readonly label = computed(() =>
    this._formatter.format(Math.round(this.value()), this.currency()),
  );
  protected readonly parts = computed(() =>
    this._formatter.parts(Math.round(this._displayed()), this.currency()),
  );

  public constructor() {
    effect(() => {
      const target = this.value();
      untracked(() => this._animateTo(target));
    });
    inject(DestroyRef).onDestroy(() => this._window?.cancelAnimationFrame(this._frame));
  }

  private _animateTo(target: number): void {
    const win = this._window;
    if (!win || win.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this._displayed.set(target);
      return;
    }

    win.cancelAnimationFrame(this._frame);
    const start = this._displayed();
    const startedAt = win.performance.now();
    const step = (time: number): void => {
      const progress = Math.min((time - startedAt) / TWEEN_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      this._displayed.set(start + (target - start) * eased);
      if (progress < 1) this._frame = win.requestAnimationFrame(step);
    };
    this._frame = win.requestAnimationFrame(step);
  }
}
