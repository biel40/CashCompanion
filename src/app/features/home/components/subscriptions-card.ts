import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyCode } from '../../../core/models/money';
import { Subscription } from '../../../core/models/subscription';
import { Amount } from '../../../shared/ui/amount/amount';
import { Icon } from '../../../shared/ui/icon/icon';
import { Monogram } from '../../../shared/ui/monogram/monogram';

@Component({
  selector: 'app-subscriptions-card',
  imports: [RouterLink, Amount, Icon, Monogram],
  template: `
    <a class="card pressable link" routerLink="/suscripciones">
      <span class="head">
        <span class="section-title">Suscripciones</span>
        <app-icon class="chevron" name="chevron-right" [size]="20" />
      </span>
      <span class="total">
        <app-amount class="figure" [value]="monthlyTotal()" [currency]="currency()" />
        <span class="per">/ mes</span>
      </span>
      <span class="foot">
        <span class="count">{{ activeCount() }} activas</span>
        <span class="stack">
          @for (sub of featured(); track sub.id) {
            <app-monogram
              [name]="sub.name"
              [color]="sub.color ?? 'slate'"
              [icon]="sub.icon"
              [size]="34"
            />
          }
        </span>
      </span>
    </a>
  `,
  styles: `
    :host {
      display: block;
    }
    .link {
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: var(--space-2);
      height: 100%;
      color: inherit;
      text-decoration: none;
    }
    .head,
    .foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .chevron {
      color: var(--text-subtle);
    }
    .total {
      display: flex;
      align-self: end;
      align-items: baseline;
      gap: var(--space-2);
    }
    .figure {
      font-size: 2.25rem;
      font-weight: var(--weight-bold);
      letter-spacing: var(--tracking-tight);
    }
    .per {
      color: var(--text-muted);
      font-weight: var(--weight-medium);
    }
    .count {
      color: var(--text-muted);
      font-size: var(--text-caption);
      font-weight: var(--weight-semibold);
    }
    .stack {
      display: flex;
    }
    @media (min-width: 1024px) {
      .link {
        padding: var(--space-8);
      }
    }
    .stack app-monogram {
      margin-inline-start: -0.625rem;
      box-shadow: 0 0 0 3px var(--surface);
    }
  `,
})
export class SubscriptionsCard {
  public readonly monthlyTotal = input.required<number>();
  public readonly currency = input.required<CurrencyCode>();
  public readonly activeCount = input.required<number>();
  public readonly featured = input.required<readonly Subscription[]>();
}
