import { AccentColor } from './accent';
import { IsoDate } from './dates';

export interface UserProfile {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly memberSince: IsoDate;
  readonly color: AccentColor;
}
