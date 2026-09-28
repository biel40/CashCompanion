import { InjectionToken } from '@angular/core';

export const APP_LOCALE = new InjectionToken<string>('APP_LOCALE', { factory: () => 'es-ES' });
