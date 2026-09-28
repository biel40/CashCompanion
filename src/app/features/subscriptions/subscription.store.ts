import { computed, inject, Service, signal } from '@angular/core';
import { monthlyEquivalent, nextChargeDate } from '../../core/domain/billing';
import { createDemoSubscriptions } from '../../core/demo/demo-data';
import { IsoDate } from '../../core/models/dates';
import { Subscription } from '../../core/models/subscription';
import { Clock } from '../../core/platform/clock';

export interface UpcomingCharge {
  readonly subscription: Subscription;
  readonly date: IsoDate;
}

/** In-memory for now; backed by SubscriptionRepository in the persistence phase. */
@Service()
export class SubscriptionStore {
  private readonly _clock = inject(Clock);
  private readonly _subscriptions = signal<readonly Subscription[]>(
    createDemoSubscriptions(this._clock.today(), this._clock.now()),
  );

  public readonly subscriptions = this._subscriptions.asReadonly();

  public readonly active = computed(() => this._subscriptions().filter((sub) => sub.active));

  /** Minor units, unrounded. */
  public readonly monthlyTotal = computed(() =>
    this.active().reduce(
      (total, sub) => total + monthlyEquivalent(sub.amountMinor, sub.billingCycle),
      0,
    ),
  );

  public readonly upcoming = computed<readonly UpcomingCharge[]>(() => {
    const today = this._clock.today();
    return this.active()
      .map((subscription) => ({ subscription, date: nextChargeDate(subscription, today) }))
      .sort((a, b) => a.date.localeCompare(b.date));
  });

  /** Most expensive first, by monthly equivalent. */
  public readonly byMonthlyCost = computed(() =>
    [...this.active()].sort(
      (a, b) =>
        monthlyEquivalent(b.amountMinor, b.billingCycle) -
        monthlyEquivalent(a.amountMinor, a.billingCycle),
    ),
  );
}
