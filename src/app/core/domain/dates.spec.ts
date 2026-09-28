import { IsoDate } from '../models/dates';
import {
  addDays,
  addMonths,
  daysBetween,
  isWithin,
  monthRange,
  previousMonthToDate,
} from './dates';

const d = (value: string): IsoDate => value as IsoDate;

describe('dates', () => {
  it('adds days across month and year boundaries', () => {
    expect(addDays(d('2026-09-30'), 1)).toBe('2026-10-01');
    expect(addDays(d('2026-01-01'), -1)).toBe('2025-12-31');
    expect(addDays(d('2026-03-28'), 7)).toBe('2026-04-04');
  });

  it('clamps to the last day when adding months', () => {
    expect(addMonths(d('2026-01-31'), 1)).toBe('2026-02-28');
    expect(addMonths(d('2028-01-31'), 1)).toBe('2028-02-29');
    expect(addMonths(d('2026-01-31'), 2)).toBe('2026-03-31');
    expect(addMonths(d('2026-01-15'), -2)).toBe('2025-11-15');
  });

  it('counts days between dates', () => {
    expect(daysBetween(d('2026-09-01'), d('2026-10-01'))).toBe(30);
    expect(daysBetween(d('2026-10-01'), d('2026-09-01'))).toBe(-30);
  });

  it('builds the full month range', () => {
    expect(monthRange(d('2026-02-14'))).toEqual({ from: '2026-02-01', to: '2026-02-28' });
  });

  it('compares with the same stretch of the previous month', () => {
    expect(previousMonthToDate(d('2026-09-27'))).toEqual({ from: '2026-08-01', to: '2026-08-27' });
    expect(previousMonthToDate(d('2026-03-31'))).toEqual({ from: '2026-02-01', to: '2026-02-28' });
  });

  it('checks inclusive ranges', () => {
    const range = { from: d('2026-09-01'), to: d('2026-09-30') };
    expect(isWithin(d('2026-09-01'), range)).toBe(true);
    expect(isWithin(d('2026-09-30'), range)).toBe(true);
    expect(isWithin(d('2026-10-01'), range)).toBe(false);
  });
});
