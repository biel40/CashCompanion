import { Component, input } from '@angular/core';
import { MoneyPipe } from '../../../core/format/money.pipe';
import { CurrencyCode } from '../../../core/models/money';
import { ChangeBadge } from '../../../shared/ui/change-badge/change-badge';
import { Monogram } from '../../../shared/ui/monogram/monogram';
import { CategoryInsight } from '../home-summary';

@Component({
  selector: 'app-insight-card',
  imports: [ChangeBadge, Monogram, MoneyPipe],
  template: `
    <p class="eyebrow">Este mes has gastado más en</p>
    <div class="body">
      <app-monogram
        [icon]="insight().category.icon"
        [color]="insight().category.color"
        [size]="48"
      />
      <div class="text">
        <p class="name">{{ insight().category.name }}</p>
        <p class="amount tabular">{{ insight().amountMinor | money: currency() : true }}</p>
      </div>
      @if (insight().change; as change) {
        <app-change-badge [change]="change" />
      }
    </div>
  `,
  host: { class: 'card' },
  styles: `
    :host {
      display: grid;
      gap: var(--space-4);
    }
    .eyebrow {
      color: var(--text-muted);
      font-size: var(--text-caption);
      font-weight: var(--weight-semibold);
    }
    .body {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }
    .text {
      flex: 1;
      min-width: 0;
    }
    .name {
      font-size: var(--text-card-title);
      font-weight: var(--weight-semibold);
    }
    .amount {
      color: var(--text-muted);
      font-weight: var(--weight-medium);
    }
  `,
})
export class InsightCard {
  public readonly insight = input.required<CategoryInsight>();
  public readonly currency = input.required<CurrencyCode>();
}
