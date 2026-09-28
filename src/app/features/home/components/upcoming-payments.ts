import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MoneyPipe } from '../../../core/format/money.pipe';
import { Icon } from '../../../shared/ui/icon/icon';
import { Monogram } from '../../../shared/ui/monogram/monogram';
import { UpcomingPayment } from '../home-summary';

@Component({
  selector: 'app-upcoming-payments',
  imports: [RouterLink, Icon, Monogram, MoneyPipe],
  template: `
    <div class="head">
      <h2 id="upcoming-title" class="section-title">Próximos pagos</h2>
      <a class="link-button" routerLink="/suscripciones">
        Ver todos <app-icon name="chevron-right" [size]="16" [strokeWidth]="2.2" />
      </a>
    </div>
    <ul class="list" role="list" aria-labelledby="upcoming-title">
      @for (payment of payments(); track payment.subscription.id) {
        <li class="row">
          <app-monogram
            [name]="payment.subscription.name"
            [color]="payment.subscription.color ?? 'slate'"
            [icon]="payment.subscription.icon"
            [size]="42"
          />
          <span class="text">
            <span class="name">{{ payment.subscription.name }}</span>
            <span class="when">{{ payment.whenLabel }}</span>
          </span>
          <span class="amount tabular">
            {{ payment.subscription.amountMinor | money: payment.subscription.currency }}
          </span>
        </li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: grid;
      gap: var(--space-2);
    }
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-inline-start: var(--space-1);
    }
    .list {
      display: grid;
      gap: var(--space-2);
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4) var(--space-3) var(--space-3);
      border-radius: var(--radius-row);
      background: var(--surface);
      box-shadow: var(--shadow-card);
    }
    .text {
      display: grid;
      flex: 1;
      min-width: 0;
    }
    .name {
      overflow: hidden;
      font-weight: var(--weight-semibold);
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .when {
      color: var(--text-muted);
      font-size: var(--text-caption);
    }
    .amount {
      font-weight: var(--weight-semibold);
    }
  `,
})
export class UpcomingPayments {
  public readonly payments = input.required<readonly UpcomingPayment[]>();
}
