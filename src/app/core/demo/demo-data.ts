import { addDays } from '../domain/dates';
import { IsoDate, IsoDateTime } from '../models/dates';
import { Expense } from '../models/expense';
import { Subscription } from '../models/subscription';

/** Demo content placed relative to today so the app always looks lived-in. */

interface DemoExpense {
  readonly name: string;
  readonly amountMinor: number;
  readonly categoryId: string;
  readonly daysAgo: number;
}

const DEMO_EXPENSES: readonly DemoExpense[] = [
  { name: 'Mercadona', amountMinor: 5432, categoryId: 'food', daysAgo: 0 },
  { name: 'Gasolina', amountMinor: 6320, categoryId: 'transport', daysAgo: 0 },
  { name: 'Amazon', amountMinor: 2999, categoryId: 'shopping', daysAgo: 1 },
  { name: 'Restaurante', amountMinor: 3850, categoryId: 'restaurants', daysAgo: 3 },
  { name: 'Farmacia', amountMinor: 1240, categoryId: 'health', daysAgo: 5 },
  { name: 'Mercadona', amountMinor: 7180, categoryId: 'food', daysAgo: 29 },
  { name: 'Gasolina', amountMinor: 5800, categoryId: 'transport', daysAgo: 31 },
  { name: 'Zara', amountMinor: 4590, categoryId: 'shopping', daysAgo: 33 },
  { name: 'Restaurante', amountMinor: 2400, categoryId: 'restaurants', daysAgo: 35 },
  { name: 'Mercadona', amountMinor: 4860, categoryId: 'food', daysAgo: 38 },
];

export function createDemoExpenses(today: IsoDate, now: IsoDateTime): Expense[] {
  return DEMO_EXPENSES.map((demo, index) => ({
    id: `demo-expense-${index}`,
    name: demo.name,
    amountMinor: demo.amountMinor,
    currency: 'EUR',
    categoryId: demo.categoryId,
    date: addDays(today, -demo.daysAgo),
    createdAt: now,
    updatedAt: now,
  }));
}

type DemoSubscription = Pick<
  Subscription,
  'id' | 'name' | 'amountMinor' | 'categoryId' | 'color' | 'startDate'
> & { readonly daysUntilNext: number };

const DEMO_SUBSCRIPTIONS: readonly DemoSubscription[] = [
  {
    id: 'demo-netflix',
    name: 'Netflix',
    amountMinor: 1599,
    categoryId: 'entertainment',
    color: 'red',
    startDate: '2024-01-12' as IsoDate,
    daysUntilNext: 4,
  },
  {
    id: 'demo-spotify',
    name: 'Spotify',
    amountMinor: 1099,
    categoryId: 'entertainment',
    color: 'mint',
    startDate: '2022-05-05' as IsoDate,
    daysUntilNext: 7,
  },
  {
    id: 'demo-icloud',
    name: 'iCloud+',
    amountMinor: 299,
    categoryId: 'subscriptions',
    color: 'sky',
    startDate: '2023-03-08' as IsoDate,
    daysUntilNext: 10,
  },
  {
    id: 'demo-chatgpt',
    name: 'ChatGPT',
    amountMinor: 2300,
    categoryId: 'subscriptions',
    color: 'teal',
    startDate: '2025-02-12' as IsoDate,
    daysUntilNext: 14,
  },
  {
    id: 'demo-gym',
    name: 'Gimnasio',
    amountMinor: 2999,
    categoryId: 'health',
    color: 'orange',
    startDate: '2025-09-17' as IsoDate,
    daysUntilNext: 19,
  },
];

export function createDemoSubscriptions(today: IsoDate, now: IsoDateTime): Subscription[] {
  return DEMO_SUBSCRIPTIONS.map(({ daysUntilNext, ...demo }) => ({
    ...demo,
    currency: 'EUR',
    billingCycle: { unit: 'month', every: 1 },
    nextBillingDate: addDays(today, daysUntilNext),
    active: true,
    createdAt: now,
    updatedAt: now,
  }));
}
