import type { IsoDateTime } from '../models/dates';

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  /** Display name from the identity provider, when it gives one. */
  readonly name: string | null;
}

export interface AuthSession {
  readonly user: AuthUser;
  readonly expiresAt: IsoDateTime;
}

export interface PasswordCredentials {
  readonly email: string;
  readonly password: string;
}

export type OAuthProvider = 'google' | 'apple';

/** Provider-agnostic failures; each gateway maps its own errors onto these. */
export type AuthErrorCode =
  'invalid_credentials' | 'email_not_confirmed' | 'rate_limited' | 'network' | 'unknown';

/** Mirrors Supabase's `{ data, error }` shape without leaking its types into the app. */
export type AuthResult<T> =
  { readonly ok: true; readonly data: T } | { readonly ok: false; readonly error: AuthErrorCode };
