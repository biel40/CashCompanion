import { IconName } from '../shared/ui/icon/icons';

export interface NavTab {
  readonly path: string;
  readonly label: string;
  readonly icon: IconName;
}

export const NAV_TABS: readonly NavTab[] = [
  { path: '/', label: 'Inicio', icon: 'home' },
  { path: '/gastos', label: 'Gastos', icon: 'receipt' },
  { path: '/suscripciones', label: 'Suscripciones', icon: 'repeat' },
  { path: '/ajustes', label: 'Ajustes', icon: 'sliders' },
];
