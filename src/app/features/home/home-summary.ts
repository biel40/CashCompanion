import { computed, inject, Service } from '@angular/core';
import { CategoryStore } from '../../core/categories/category.store';
import { addDays, monthToDate, previousMonthToDate } from '../../core/domain/dates';
import {
  relativeChange,
  SpendingSources,
  spendingByCategory,
  totalSpent,
} from '../../core/domain/spending';
import { DateFormatter } from '../../core/format/date-formatter';
import { Category } from '../../core/models/category';
import { IsoDate } from '../../core/models/dates';
import { Subscription } from '../../core/models/subscription';
import { Clock } from '../../core/platform/clock';
import { ExpenseStore } from '../expenses/expense.store';
import { SubscriptionStore } from '../subscriptions/subscription.store';

const UPCOMING_LIMIT = 3;
const FEATURED_SUBSCRIPTIONS = 3;

export interface UpcomingPayment {
  readonly subscription: Subscription;
  readonly whenLabel: string;
}

export interface CategoryInsight {
  readonly category: Category;
  readonly amountMinor: number;
  readonly change: number | null;
}

/** Everything Home shows, derived from the feature stores. Provided by HomePage. */
@Service({ autoProvided: false })
export class HomeSummary {
  private readonly _dates = inject(DateFormatter);
  private readonly _categories = inject(CategoryStore);
  private readonly _expenses = inject(ExpenseStore);
  private readonly _subscriptions = inject(SubscriptionStore);
  private readonly _today = inject(Clock).today();

  private readonly _thisPeriod = monthToDate(this._today);
  private readonly _previousPeriod = previousMonthToDate(this._today);
  private readonly _sources = computed<SpendingSources>(() => ({
    expenses: this._expenses.expenses(),
    subscriptions: this._subscriptions.subscriptions(),
  }));

  public readonly monthName = this._dates.monthName(this._today);
  public readonly previousMonthName = this._dates
    .monthName(this._previousPeriod.from)
    .toLowerCase();

  public readonly spent = computed(() => totalSpent(this._sources(), this._thisPeriod));
  public readonly spentChange = computed(() =>
    relativeChange(this.spent(), totalSpent(this._sources(), this._previousPeriod)),
  );

  public readonly subscriptionsMonthly = this._subscriptions.monthlyTotal;
  public readonly activeSubscriptions = computed(() => this._subscriptions.active().length);
  public readonly featuredSubscriptions = computed(() =>
    this._subscriptions.byMonthlyCost().slice(0, FEATURED_SUBSCRIPTIONS),
  );

  public readonly upcoming = computed<readonly UpcomingPayment[]>(() =>
    this._subscriptions
      .upcoming()
      .slice(0, UPCOMING_LIMIT)
      .map(({ subscription, date }) => ({ subscription, whenLabel: this._whenLabel(date) })),
  );

  public readonly topCategory = computed<CategoryInsight | null>(() => {
    const current = spendingByCategory(this._sources(), this._thisPeriod);
    const previous = spendingByCategory(this._sources(), this._previousPeriod);

    let top: [string, number] | null = null;
    for (const entry of current) {
      if (!top || entry[1] > top[1]) top = entry;
    }
    if (!top) return null;

    const [categoryId, amountMinor] = top;
    return {
      category: this._categories.get(categoryId),
      amountMinor,
      change: relativeChange(amountMinor, previous.get(categoryId) ?? 0),
    };
  });

  private _whenLabel(date: IsoDate): string {
    if (date === this._today) return 'Hoy';
    if (date === addDays(this._today, 1)) return 'Mañana';
    return this._dates.dayMonth(date);
  }
}
