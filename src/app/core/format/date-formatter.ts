import { inject, Service } from '@angular/core';
import { IsoDate } from '../models/dates';
import { parseIsoDate } from '../domain/dates';
import { APP_LOCALE } from './locale';

@Service()
export class DateFormatter {
  private readonly _locale = inject(APP_LOCALE);
  private readonly _dayMonth = this._create({ day: 'numeric', month: 'short' });
  private readonly _monthName = this._create({ month: 'long' });

  /** "2 oct" */
  public dayMonth(date: IsoDate): string {
    return this._dayMonth.format(this._toUtcDate(date)).replace('.', '');
  }

  /** "Septiembre" */
  public monthName(date: IsoDate): string {
    return this._capitalize(this._monthName.format(this._toUtcDate(date)));
  }

  private _create(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
    return new Intl.DateTimeFormat(this._locale, { ...options, timeZone: 'UTC' });
  }

  private _toUtcDate(date: IsoDate): Date {
    const { year, month, day } = parseIsoDate(date);
    return new Date(Date.UTC(year, month - 1, day));
  }

  private _capitalize(text: string): string {
    return text.charAt(0).toLocaleUpperCase(this._locale) + text.slice(1);
  }
}
