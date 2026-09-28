import { DateRange, IsoDate } from '../models/dates';

const MS_PER_DAY = 86_400_000;

interface DateParts {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export function isoDate(year: number, month: number, day: number): IsoDate {
  const y = String(year).padStart(4, '0');
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}` as IsoDate;
}

export function parseIsoDate(date: IsoDate): DateParts {
  const [year = 0, month = 1, day = 1] = date.split('-').map(Number);
  return { year, month, day };
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function addDays(date: IsoDate, days: number): IsoDate {
  const { year, month, day } = parseIsoDate(date);
  const shifted = new Date(Date.UTC(year, month - 1, day) + days * MS_PER_DAY);
  return isoDate(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, shifted.getUTCDate());
}

/** Adds months keeping the day of month, clamped to the last day (Jan 31 + 1 → Feb 28/29). */
export function addMonths(date: IsoDate, months: number): IsoDate {
  const { year, month, day } = parseIsoDate(date);
  const monthIndex = year * 12 + (month - 1) + months;
  const targetYear = Math.floor(monthIndex / 12);
  const targetMonth = (monthIndex % 12) + 1;
  return isoDate(targetYear, targetMonth, Math.min(day, daysInMonth(targetYear, targetMonth)));
}

export function daysBetween(from: IsoDate, to: IsoDate): number {
  const a = parseIsoDate(from);
  const b = parseIsoDate(to);
  return Math.round(
    (Date.UTC(b.year, b.month - 1, b.day) - Date.UTC(a.year, a.month - 1, a.day)) / MS_PER_DAY,
  );
}

export function monthRange(date: IsoDate): DateRange {
  const { year, month } = parseIsoDate(date);
  return { from: isoDate(year, month, 1), to: isoDate(year, month, daysInMonth(year, month)) };
}

/** From the 1st of the month up to `today`. */
export function monthToDate(today: IsoDate): DateRange {
  return { from: monthRange(today).from, to: today };
}

/** Same stretch of days in the previous month, clamped to its length (Mar 1–31 → Feb 1–28). */
export function previousMonthToDate(today: IsoDate): DateRange {
  const sameDayLastMonth = addMonths(today, -1);
  return { from: monthRange(sameDayLastMonth).from, to: sameDayLastMonth };
}

export function isWithin(date: IsoDate, range: DateRange): boolean {
  return date >= range.from && date <= range.to;
}

export function toIsoDate(instant: Date): IsoDate {
  return isoDate(instant.getFullYear(), instant.getMonth() + 1, instant.getDate());
}
