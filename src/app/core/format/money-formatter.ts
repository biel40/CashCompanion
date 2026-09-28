import { inject, Service } from '@angular/core';
import { CurrencyCode } from '../models/money';
import { APP_LOCALE } from './locale';

export type MoneyPartKind = 'major' | 'minor' | 'currency';

export interface MoneyPart {
  readonly kind: MoneyPartKind;
  readonly text: string;
}

@Service()
export class MoneyFormatter {
  private readonly _locale = inject(APP_LOCALE);
  private readonly _formats = new Map<string, Intl.NumberFormat>();
  private readonly _percent = new Intl.NumberFormat(this._locale, {
    style: 'percent',
    maximumFractionDigits: 0,
    signDisplay: 'exceptZero',
  });

  public format(amountMinor: number, currency: CurrencyCode, wholeUnits = false): string {
    return this._formatter(currency, wholeUnits).format(amountMinor / 100);
  }

  /** Splits a formatted amount so the integer part can be emphasised over decimals and symbol. */
  public parts(amountMinor: number, currency: CurrencyCode): MoneyPart[] {
    return this._formatter(currency, false)
      .formatToParts(amountMinor / 100)
      .map((part) => ({ kind: this._kindOf(part.type), text: part.value }));
  }

  public percentChange(ratio: number): string {
    return this._percent.format(ratio);
  }

  private _formatter(currency: CurrencyCode, wholeUnits: boolean): Intl.NumberFormat {
    const key = `${currency}:${wholeUnits}`;
    let formatter = this._formats.get(key);
    if (!formatter) {
      formatter = new Intl.NumberFormat(this._locale, {
        style: 'currency',
        currency,
        useGrouping: 'always',
        ...(wholeUnits && { maximumFractionDigits: 0, minimumFractionDigits: 0 }),
      });
      this._formats.set(key, formatter);
    }
    return formatter;
  }

  private _kindOf(type: Intl.NumberFormatPartTypes): MoneyPartKind {
    switch (type) {
      case 'decimal':
      case 'fraction':
        return 'minor';
      case 'currency':
      case 'literal':
        return 'currency';
      default:
        return 'major';
    }
  }
}
