import { Component, inject } from '@angular/core';
import { DEFAULT_CURRENCY } from '../../core/models/money';
import { HeroCard } from './components/hero-card';
import { InsightCard } from './components/insight-card';
import { SubscriptionsCard } from './components/subscriptions-card';
import { UpcomingPayments } from './components/upcoming-payments';
import { HomeSummary } from './home-summary';

@Component({
  selector: 'app-home-page',
  imports: [HeroCard, SubscriptionsCard, InsightCard, UpcomingPayments],
  providers: [HomeSummary],
  template: `
    <div class="stack stagger">
      <header class="greeting" style="--i: 0">
        <h1 class="hello">Hola <span aria-hidden="true">👋</span></h1>
        <p class="month">{{ summary.monthName }}</p>
      </header>

      <app-hero-card
        style="--i: 1"
        [spent]="summary.spent()"
        [currency]="currency"
        [change]="summary.spentChange()"
        [comparedWith]="summary.previousMonthName"
      />

      <app-subscriptions-card
        style="--i: 2"
        [monthlyTotal]="summary.subscriptionsMonthly()"
        [currency]="currency"
        [activeCount]="summary.activeSubscriptions()"
        [featured]="summary.featuredSubscriptions()"
      />

      @if (summary.upcoming().length > 0) {
        <app-upcoming-payments style="--i: 3" [payments]="summary.upcoming()" />
      }

      @if (summary.topCategory(); as insight) {
        <app-insight-card style="--i: 4" [insight]="insight" [currency]="currency" />
      }
    </div>
  `,
  styles: `
    .stack {
      display: grid;
      gap: var(--space-4);
    }
    .greeting {
      padding: var(--space-4) var(--space-1) var(--space-2);
    }
    .hello {
      color: var(--text-muted);
      font-size: 1.0625rem;
      font-weight: var(--weight-semibold);
      letter-spacing: 0;
    }
    .month {
      font-size: var(--text-display);
      font-weight: var(--weight-bold);
      letter-spacing: var(--tracking-tight);
      line-height: 1.15;
    }
    app-upcoming-payments {
      margin-top: var(--space-3);
    }
  `,
})
export class HomePage {
  protected readonly summary = inject(HomeSummary);
  protected readonly currency = DEFAULT_CURRENCY;
}
