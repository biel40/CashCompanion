import { Category } from '../models/category';

export const DEFAULT_CATEGORIES: readonly Category[] = [
  { id: 'food', name: 'Alimentación', icon: 'cart', color: 'mint', builtIn: true },
  { id: 'transport', name: 'Transporte', icon: 'car', color: 'sky', builtIn: true },
  { id: 'home', name: 'Casa', icon: 'sofa', color: 'amber', builtIn: true },
  { id: 'entertainment', name: 'Entretenimiento', icon: 'film', color: 'violet', builtIn: true },
  { id: 'shopping', name: 'Compras', icon: 'bag', color: 'pink', builtIn: true },
  { id: 'health', name: 'Salud', icon: 'heart', color: 'red', builtIn: true },
  { id: 'restaurants', name: 'Restaurantes', icon: 'utensils', color: 'orange', builtIn: true },
  { id: 'travel', name: 'Viajes', icon: 'suitcase', color: 'teal', builtIn: true },
  { id: 'subscriptions', name: 'Suscripciones', icon: 'repeat', color: 'indigo', builtIn: true },
  { id: 'other', name: 'Otros', icon: 'grid', color: 'slate', builtIn: true },
];
