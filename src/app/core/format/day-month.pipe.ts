import { inject, Pipe, PipeTransform } from '@angular/core';
import { IsoDate } from '../models/dates';
import { DateFormatter } from './date-formatter';

@Pipe({ name: 'dayMonth' })
export class DayMonthPipe implements PipeTransform {
  private readonly _formatter = inject(DateFormatter);

  public transform(date: IsoDate): string {
    return this._formatter.dayMonth(date);
  }
}
