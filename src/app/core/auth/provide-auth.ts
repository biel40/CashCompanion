import type { EnvironmentProviders } from '@angular/core';
import { inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { isSupabaseConfigured, SupabaseService } from '../supabase/supabase.service';
import { AuthGateway } from './auth-gateway';
import { AuthStore } from './auth.store';
import { DebugAuthGateway } from './debug-auth-gateway';
import { DemoAuthGateway } from './demo-auth-gateway';
import { SupabaseAuthGateway } from './supabase-auth-gateway';

/** TEMPORARY debugging switch: `true` skips the login with a mock session. Set back to `false`. */
const SKIP_LOGIN = true;

/** Uses Supabase when `.env` has credentials; otherwise falls back to the local demo gateway. */
export function provideAuth(): EnvironmentProviders {
  const gateway = SKIP_LOGIN
    ? [{ provide: AuthGateway, useClass: DebugAuthGateway }]
    : isSupabaseConfigured()
      ? [SupabaseService, { provide: AuthGateway, useClass: SupabaseAuthGateway }]
      : [{ provide: AuthGateway, useClass: DemoAuthGateway }];

  return makeEnvironmentProviders([
    ...gateway,
    provideAppInitializer(() => inject(AuthStore).restore()),
  ]);
}
