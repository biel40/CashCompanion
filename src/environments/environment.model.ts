export interface Environment {
  /** Project URL, e.g. `https://xxxx.supabase.co`. Empty → demo mode. */
  readonly supabaseUrl: string;
  /** Public `anon` (or publishable) key. Never put the `service_role` key here. */
  readonly supabaseAnonKey: string;
}
