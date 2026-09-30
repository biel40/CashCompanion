import type { EnvironmentProviders } from '@angular/core';
import { inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { isSupabaseConfigured } from '../supabase/supabase.service';
import { AuthGateway } from './auth-gateway';
import { AuthStore } from './auth.store';
import { DemoAuthGateway } from './demo-auth-gateway';
import { SupabaseAuthGateway } from './supabase-auth-gateway';

/** Uses Supabase when `.env` has credentials; otherwise falls back to the local demo gateway. */
export function provideAuth(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: AuthGateway,
      useClass: isSupabaseConfigured() ? SupabaseAuthGateway : DemoAuthGateway,
    },
    provideAppInitializer(() => inject(AuthStore).restore()),
  ]);
}
