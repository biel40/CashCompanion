import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthStore } from './auth.store';

export const LOGIN_PATH = '/login';

/** Private areas: anonymous visitors go to the login and come back afterwards. */
export const authGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthStore).isAuthenticated()) return true;
  const queryParams = state.url === '/' ? {} : { redirect: state.url };
  return inject(Router).createUrlTree([LOGIN_PATH], { queryParams });
};

/** The login makes no sense with a session: go straight into the app. */
export const guestGuard: CanActivateFn = () =>
  inject(AuthStore).isAuthenticated() ? inject(Router).createUrlTree(['/']) : true;

/** Only in-app paths are valid redirects, so `?redirect=` cannot send people off-site. */
export function safeRedirect(target: string | null | undefined): string {
  if (!target || !target.startsWith('/') || target.startsWith('//')) return '/';
  if (target.startsWith(LOGIN_PATH)) return '/';
  return target;
}
