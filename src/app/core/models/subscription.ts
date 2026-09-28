import { AccentColor } from './accent';
import { CategoryId } from './category';
import { IsoDate, IsoDateTime } from './dates';
import { CurrencyCode } from './money';
import { IconName } from '../../shared/ui/icon/icons';

export type BillingUnit = 'week' | 'month' | 'year';

/** Charged every `every` units: monthly is `{ unit: 'month', every: 1 }`, quarterly `{ unit: 'month', every: 3 }`. */
export interface BillingCycle {
  readonly unit: BillingUnit;
  readonly every: number;
}

export interface Subscription {
  readonly id: string;
  readonly name: string;
  /** Amount per charge in minor units (cents). */
  readonly amountMinor: number;
  readonly currency: CurrencyCode;
  readonly billingCycle: BillingCycle;
  /** A known charge date; past and future charges are derived from it. */
  readonly nextBillingDate: IsoDate;
  readonly startDate: IsoDate;
  readonly categoryId: CategoryId;
  readonly icon?: IconName;
  readonly color?: AccentColor;
  readonly active: boolean;
  readonly createdAt: IsoDateTime;
  readonly updatedAt: IsoDateTime;
}
