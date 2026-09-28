import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'CashCompanion',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'gastos',
    title: 'Gastos · CashCompanion',
    loadComponent: () => import('./features/expenses/expenses.page').then((m) => m.ExpensesPage),
  },
  {
    path: 'suscripciones',
    title: 'Suscripciones · CashCompanion',
    loadComponent: () =>
      import('./features/subscriptions/subscriptions.page').then((m) => m.SubscriptionsPage),
  },
  {
    path: 'ajustes',
    title: 'Ajustes · CashCompanion',
    loadComponent: () => import('./features/settings/settings.page').then((m) => m.SettingsPage),
  },
  { path: '**', redirectTo: '' },
];
