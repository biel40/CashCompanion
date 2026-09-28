import { AccentColor } from './accent';
import { IconName } from '../../shared/ui/icon/icons';

export type CategoryId = string;

export interface Category {
  readonly id: CategoryId;
  readonly name: string;
  readonly icon: IconName;
  readonly color: AccentColor;
  readonly builtIn: boolean;
}
