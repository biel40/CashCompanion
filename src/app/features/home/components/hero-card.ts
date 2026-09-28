import { Component, input } from '@angular/core';
import { CurrencyCode } from '../../../core/models/money';
import { Amount } from '../../../shared/ui/amount/amount';
import { ChangeBadge } from '../../../shared/ui/change-badge/change-badge';

@Component({
  selector: 'app-hero-card',
  imports: [Amount, ChangeBadge],
  template: `
    <div class="glow" aria-hidden="true"></div>
    <app-amount class="figure" [value]="spent()" [currency]="currency()" />
    <p class="caption">Gastado este mes</p>
    @if (change(); as change) {
      <app-change-badge class="badge" [change]="change" [suffix]="'vs. ' + comparedWith()" />
    }
  `,
  styles: `
    :host {
      position: relative;
      display: grid;
      justify-items: start;
      gap: var(--space-1);
      padding: var(--space-8) var(--space-6) var(--space-6);
      border-radius: var(--radius-hero);
      background: var(--hero-bg);
      color: var(--hero-fg);
      box-shadow: var(--shadow-float);
      overflow: hidden;
      isolation: isolate;

      --badge-bg: var(--hero-chip-bg);
      --badge-up: var(--hero-up);
      --badge-down: var(--hero-down);
      --badge-muted: var(--hero-muted);
    }
    .glow {
      position: absolute;
      z-index: -1;
      top: -38%;
      right: -22%;
      width: 62%;
      aspect-ratio: 1;
      border-radius: 50%;
      background: radial-gradient(circle, var(--hero-glow) 0%, transparent 70%);
      filter: blur(24px);
    }
    .figure {
      font-size: var(--text-hero);
      font-weight: var(--weight-bold);
      letter-spacing: var(--tracking-tight);
      line-height: 1;
    }
    .caption {
      color: var(--hero-muted);
      font-size: var(--text-body);
      font-weight: var(--weight-medium);
    }
    .badge {
      margin-top: var(--space-5);
    }
    @media (min-width: 1024px) {
      :host {
        align-content: end;
        min-height: 17rem;
        padding: var(--space-10);
      }
      .figure {
        font-size: 5rem;
      }
      .caption {
        font-size: var(--text-card-title);
      }
    }
  `,
})
export class HeroCard {
  public readonly spent = input.required<number>();
  public readonly currency = input.required<CurrencyCode>();
  public readonly change = input<number | null>(null);
  public readonly comparedWith = input.required<string>();
}
