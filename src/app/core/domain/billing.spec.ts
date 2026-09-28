import { IsoDate, IsoDateTime } from '../models/dates';
import { BillingCycle, Subscription } from '../models/subscription';
import { annualEquivalent, chargesWithin, monthlyEquivalent, nextChargeDate } from './billing';

const d = (value: string): IsoDate => value as IsoDate;

function subscription(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: 's1',
    name: 'Netflix',
    amountMinor: 1599,
    currency: 'EUR',
    billingCycle: { unit: 'month', every: 1 },
    nextBillingDate: d('2026-10-02'),
    startDate: d('2024-01-12'),
    categoryId: 'entertainment',
    active: true,
    createdAt: '2024-01-12T10:00:00.000Z' as IsoDateTime,
    updatedAt: '2024-01-12T10:00:00.000Z' as IsoDateTime,
    ...overrides,
  };
}

describe('billing equivalents', () => {
  const cases: readonly [BillingCycle, number, number][] = [
    [{ unit: 'week', every: 1 }, 1000, (1000 * 52) / 12],
    [{ unit: 'month', every: 1 }, 1599, 1599],
    [{ unit: 'month', every: 3 }, 3000, 1000],
    [{ unit: 'month', every: 6 }, 6000, 1000],
    [{ unit: 'year', every: 1 }, 12000, 1000],
    [{ unit: 'year', every: 2 }, 24000, 1000],
  ];

  it.each(cases)('%o of %i is %d per month', (cycle, amount, expected) => {
    expect(monthlyEquivalent(amount, cycle)).toBeCloseTo(expected, 6);
  });

  it('annualises from the monthly equivalent', () => {
    expect(annualEquivalent(1599, { unit: 'month', every: 1 })).toBe(19188);
    expect(annualEquivalent(1000, { unit: 'week', every: 1 })).toBeCloseTo(52000, 6);
  });
});

describe('nextChargeDate', () => {
  it('returns the anchor when it is still ahead', () => {
    expect(nextChargeDate(subscription(), d('2026-09-27'))).toBe('2026-10-02');
  });

  it('rolls a past anchor forward', () => {
    const sub = subscription({ nextBillingDate: d('2026-01-02') });
    expect(nextChargeDate(sub, d('2026-09-27'))).toBe('2026-10-02');
    expect(nextChargeDate(sub, d('2026-10-02'))).toBe('2026-10-02');
  });

  it('keeps end-of-month anchors on the last day', () => {
    const sub = subscription({ nextBillingDate: d('2026-01-31') });
    expect(nextChargeDate(sub, d('2026-02-01'))).toBe('2026-02-28');
    expect(nextChargeDate(sub, d('2026-03-01'))).toBe('2026-03-31');
  });

  it('handles weekly and yearly cycles', () => {
    const weekly = subscription({
      billingCycle: { unit: 'week', every: 1 },
      nextBillingDate: d('2026-09-01'),
    });
    expect(nextChargeDate(weekly, d('2026-09-27'))).toBe('2026-09-29');

    const yearly = subscription({
      billingCycle: { unit: 'year', every: 1 },
      nextBillingDate: d('2025-03-10'),
    });
    expect(nextChargeDate(yearly, d('2026-09-27'))).toBe('2027-03-10');
  });

  it('never returns a date before the start date', () => {
    const sub = subscription({ nextBillingDate: d('2026-09-02'), startDate: d('2026-11-01') });
    expect(nextChargeDate(sub, d('2026-09-27'))).toBe('2026-11-02');
  });
});

describe('chargesWithin', () => {
  const september = { from: d('2026-09-01'), to: d('2026-09-30') };

  it('finds the monthly charge in the range', () => {
    expect(chargesWithin(subscription(), september)).toEqual(['2026-09-02']);
  });

  it('finds every weekly charge in the range', () => {
    const weekly = subscription({
      billingCycle: { unit: 'week', every: 1 },
      nextBillingDate: d('2026-10-06'),
    });
    expect(chargesWithin(weekly, september)).toEqual([
      '2026-09-01',
      '2026-09-08',
      '2026-09-15',
      '2026-09-22',
      '2026-09-29',
    ]);
  });

  it('ignores inactive subscriptions and charges before the start date', () => {
    expect(chargesWithin(subscription({ active: false }), september)).toEqual([]);
    expect(chargesWithin(subscription({ startDate: d('2026-09-10') }), september)).toEqual([]);
  });

  it('returns nothing for quarterly cycles outside the range', () => {
    const quarterly = subscription({
      billingCycle: { unit: 'month', every: 3 },
      nextBillingDate: d('2026-11-15'),
    });
    expect(chargesWithin(quarterly, september)).toEqual([]);
    expect(chargesWithin(quarterly, { from: d('2026-08-01'), to: d('2026-08-31') })).toEqual([
      '2026-08-15',
    ]);
  });
});
