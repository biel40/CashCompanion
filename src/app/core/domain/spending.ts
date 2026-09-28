import { CategoryId } from '../models/category';
import { DateRange } from '../models/dates';
import { Expense } from '../models/expense';
import { Subscription } from '../models/subscription';
import { chargesWithin } from './billing';
import { isWithin } from './dates';

export interface SpendingSources {
  readonly expenses: readonly Expense[];
  readonly subscriptions: readonly Subscription[];
}

/** Spending per category in minor units: one-off expenses plus subscription charges in range. */
export function spendingByCategory(
  { expenses, subscriptions }: SpendingSources,
  range: DateRange,
): ReadonlyMap<CategoryId, number> {
  const totals = new Map<CategoryId, number>();
  const add = (categoryId: CategoryId, amount: number): void => {
    totals.set(categoryId, (totals.get(categoryId) ?? 0) + amount);
  };

  for (const expense of expenses) {
    if (isWithin(expense.date, range)) add(expense.categoryId, expense.amountMinor);
  }
  for (const subscription of subscriptions) {
    const charges = chargesWithin(subscription, range).length;
    if (charges > 0) add(subscription.categoryId, charges * subscription.amountMinor);
  }
  return totals;
}

export function totalSpent(sources: SpendingSources, range: DateRange): number {
  let total = 0;
  for (const amount of spendingByCategory(sources, range).values()) total += amount;
  return total;
}

/** Relative change (0.08 = +8 %), or `null` when there is no baseline to compare with. */
export function relativeChange(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return (current - previous) / previous;
}
