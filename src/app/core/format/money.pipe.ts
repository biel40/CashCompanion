import { inject, Pipe, PipeTransform } from '@angular/core';
import { CurrencyCode } from '../models/money';
import { MoneyFormatter } from './money-formatter';

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  private readonly _formatter = inject(MoneyFormatter);

  public transform(amountMinor: number, currency: CurrencyCode, wholeUnits = false): string {
    return this._formatter.format(amountMinor, currency, wholeUnits);
  }
}
