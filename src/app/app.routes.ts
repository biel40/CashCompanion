import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guards';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Entrar · CashCompanion',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: '',
        title: 'CashCompanion',
        loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'gastos',
        title: 'Gastos · CashCompanion',
        loadComponent: () =>
          import('./features/expenses/expenses.page').then((m) => m.ExpensesPage),
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
        loadComponent: () =>
          import('./features/settings/settings.page').then((m) => m.SettingsPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
