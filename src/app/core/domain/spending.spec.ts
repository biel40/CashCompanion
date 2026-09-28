import { IsoDate, IsoDateTime } from '../models/dates';
import { Expense } from '../models/expense';
import { Subscription } from '../models/subscription';
import { relativeChange, spendingByCategory, totalSpent } from './spending';

const d = (value: string): IsoDate => value as IsoDate;
const timestamp = '2026-09-01T10:00:00.000Z' as IsoDateTime;

const expense = (name: string, amountMinor: number, categoryId: string, date: string): Expense => ({
  id: name,
  name,
  amountMinor,
  currency: 'EUR',
  categoryId,
  date: d(date),
  createdAt: timestamp,
  updatedAt: timestamp,
});

const netflix: Subscription = {
  id: 'netflix',
  name: 'Netflix',
  amountMinor: 1599,
  currency: 'EUR',
  billingCycle: { unit: 'month', every: 1 },
  nextBillingDate: d('2026-10-02'),
  startDate: d('2024-01-12'),
  categoryId: 'entertainment',
  active: true,
  createdAt: timestamp,
  updatedAt: timestamp,
};

const sources = {
  expenses: [
    expense('Mercadona', 5432, 'food', '2026-09-27'),
    expense('Lidl', 2000, 'food', '2026-09-03'),
    expense('Gasolina', 6320, 'transport', '2026-09-26'),
    expense('Agosto', 9999, 'food', '2026-08-30'),
  ],
  subscriptions: [netflix],
};

describe('spending', () => {
  const monthToDate = { from: d('2026-09-01'), to: d('2026-09-27') };

  it('groups expenses and subscription charges by category', () => {
    const byCategory = spendingByCategory(sources, monthToDate);
    expect(byCategory.get('food')).toBe(7432);
    expect(byCategory.get('transport')).toBe(6320);
    expect(byCategory.get('entertainment')).toBe(1599);
  });

  it('filters by month', () => {
    expect(totalSpent(sources, monthToDate)).toBe(7432 + 6320 + 1599);
    expect(totalSpent(sources, { from: d('2026-08-01'), to: d('2026-08-31') })).toBe(9999 + 1599);
  });

  it('only counts subscription charges already due', () => {
    expect(totalSpent(sources, { from: d('2026-09-03'), to: d('2026-09-27') })).toBe(7432 + 6320);
  });

  it('computes relative change only with a baseline', () => {
    expect(relativeChange(108, 100)).toBeCloseTo(0.08);
    expect(relativeChange(92, 100)).toBeCloseTo(-0.08);
    expect(relativeChange(50, 0)).toBeNull();
  });
});
