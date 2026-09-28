import type { EnvironmentProviders } from '@angular/core';
import { inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { AuthGateway } from './auth-gateway';
import { AuthStore } from './auth.store';
import { DemoAuthGateway } from './demo-auth-gateway';

/** Swap `DemoAuthGateway` for a `SupabaseAuthGateway` here once the backend exists. */
export function provideAuth(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: AuthGateway, useClass: DemoAuthGateway },
    provideAppInitializer(() => inject(AuthStore).restore()),
  ]);
}
