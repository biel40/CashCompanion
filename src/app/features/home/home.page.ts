import { Component, inject } from '@angular/core';
import { DEFAULT_CURRENCY } from '../../core/models/money';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { ThemeToggle } from '../../shared/ui/theme-toggle/theme-toggle';
import { ProfilePanel } from '../profile/profile-panel';
import { ProfileStore } from '../profile/profile.store';
import { HeroCard } from './components/hero-card';
import { InsightCard } from './components/insight-card';
import { SubscriptionsCard } from './components/subscriptions-card';
import { UpcomingPayments } from './components/upcoming-payments';
import { HomeSummary } from './home-summary';

@Component({
  selector: 'app-home-page',
  imports: [Avatar, ThemeToggle, HeroCard, SubscriptionsCard, InsightCard, UpcomingPayments],
  providers: [HomeSummary],
  template: `
    <div class="stack stagger">
      <header class="greeting" style="--i: 0">
        <div>
          <h1 class="hello">Hola, {{ firstName() }} <span aria-hidden="true">👋</span></h1>
          <p class="month">{{ summary.monthName }}</p>
        </div>
        <div class="actions">
          <app-theme-toggle />
          <button
            type="button"
            class="avatar-button pressable"
            aria-label="Ver perfil"
            aria-haspopup="dialog"
            (click)="profilePanel.setOpen(true)"
          >
            <app-avatar [name]="profile().name" [color]="profile().color" />
          </button>
        </div>
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
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-3);
      padding: var(--space-4) var(--space-1) var(--space-2);
    }
    .actions {
      display: flex;
      gap: var(--space-2);
    }
    .avatar-button {
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: none;
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
    @media (min-width: 1024px) {
      .stack {
        grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
        gap: var(--space-6);
        align-items: start;
      }
      .greeting {
        grid-column: 1 / -1;
        padding-top: var(--space-2);
      }
      /* The sidebar already shows the profile on desktop */
      .avatar-button {
        display: none;
      }
      app-hero-card,
      app-subscriptions-card {
        align-self: stretch;
      }
      app-upcoming-payments {
        margin-top: 0;
      }
      /* Line the insight card up with the payment rows, below their heading */
      app-insight-card {
        margin-top: calc(var(--tap-target) + var(--space-2));
      }
    }
  `,
})
export class HomePage {
  private readonly _profileStore = inject(ProfileStore);

  protected readonly summary = inject(HomeSummary);
  protected readonly currency = DEFAULT_CURRENCY;
  protected readonly profilePanel = inject(ProfilePanel);
  protected readonly profile = this._profileStore.profile;
  protected readonly firstName = this._profileStore.firstName;
}
