import { Service } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

/** True when `.env` provided credentials; otherwise the app keeps using the demo gateway. */
export function isSupabaseConfigured(): boolean {
  return environment.supabaseUrl !== '' && environment.supabaseAnonKey !== '';
}

/** Single shared Supabase client (auth today; database/storage later). */
@Service({ autoProvided: false })
export class SupabaseService {
  public readonly client: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseAnonKey,
  );
}
