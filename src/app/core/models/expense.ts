import { CategoryId } from './category';
import { IsoDate, IsoDateTime } from './dates';
import { CurrencyCode } from './money';

export interface Expense {
  readonly id: string;
  readonly name: string;
  /** Amount in minor units (cents). */
  readonly amountMinor: number;
  readonly currency: CurrencyCode;
  readonly categoryId: CategoryId;
  readonly date: IsoDate;
  readonly note?: string;
  readonly createdAt: IsoDateTime;
  readonly updatedAt: IsoDateTime;
}
