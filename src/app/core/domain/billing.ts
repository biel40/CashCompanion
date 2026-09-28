import { DateRange, IsoDate } from '../models/dates';
import { BillingCycle, Subscription } from '../models/subscription';
import { addDays, addMonths, daysBetween } from './dates';

const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;
const AVERAGE_DAYS_PER_MONTH = 30.44;

/** Monthly equivalent in minor units. Not rounded: round only when displaying. */
export function monthlyEquivalent(amountMinor: number, cycle: BillingCycle): number {
  switch (cycle.unit) {
    case 'week':
      return (amountMinor * WEEKS_PER_YEAR) / MONTHS_PER_YEAR / cycle.every;
    case 'month':
      return amountMinor / cycle.every;
    case 'year':
      return amountMinor / (MONTHS_PER_YEAR * cycle.every);
  }
}

export function annualEquivalent(amountMinor: number, cycle: BillingCycle): number {
  return monthlyEquivalent(amountMinor, cycle) * MONTHS_PER_YEAR;
}

/** The n-th charge counted from the anchor date (n may be negative). */
export function chargeDateAt(anchor: IsoDate, cycle: BillingCycle, n: number): IsoDate {
  switch (cycle.unit) {
    case 'week':
      return addDays(anchor, 7 * cycle.every * n);
    case 'month':
      return addMonths(anchor, cycle.every * n);
    case 'year':
      return addMonths(anchor, MONTHS_PER_YEAR * cycle.every * n);
  }
}

function approximateCycleDays(cycle: BillingCycle): number {
  switch (cycle.unit) {
    case 'week':
      return 7 * cycle.every;
    case 'month':
      return AVERAGE_DAYS_PER_MONTH * cycle.every;
    case 'year':
      return AVERAGE_DAYS_PER_MONTH * MONTHS_PER_YEAR * cycle.every;
  }
}

/** Index of the first charge on or after `date`. */
function firstIndexOnOrAfter(anchor: IsoDate, cycle: BillingCycle, date: IsoDate): number {
  let n = Math.floor(daysBetween(anchor, date) / approximateCycleDays(cycle));
  while (chargeDateAt(anchor, cycle, n) < date) n++;
  while (chargeDateAt(anchor, cycle, n - 1) >= date) n--;
  return n;
}

/** Next charge on or after `today`, derived from the stored anchor date. */
export function nextChargeDate(subscription: Subscription, today: IsoDate): IsoDate {
  const { nextBillingDate: anchor, billingCycle: cycle, startDate } = subscription;
  const from = startDate > today ? startDate : today;
  return chargeDateAt(anchor, cycle, firstIndexOnOrAfter(anchor, cycle, from));
}

/** All charges of an active subscription within the range, never before its start date. */
export function chargesWithin(subscription: Subscription, range: DateRange): IsoDate[] {
  if (!subscription.active) return [];

  const { nextBillingDate: anchor, billingCycle: cycle, startDate } = subscription;
  const from = startDate > range.from ? startDate : range.from;
  const charges: IsoDate[] = [];

  for (let n = firstIndexOnOrAfter(anchor, cycle, from); ; n++) {
    const date = chargeDateAt(anchor, cycle, n);
    if (date > range.to) break;
    charges.push(date);
  }
  return charges;
}
