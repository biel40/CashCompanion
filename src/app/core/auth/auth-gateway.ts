import type { AuthResult, AuthSession, OAuthProvider, PasswordCredentials } from './auth.models';

/**
 * Port to the authentication backend. The app only talks to this abstraction, so swapping the
 * demo implementation for Supabase (`supabase.auth.*`) is a one-line change in `provideAuth()`.
 */
export abstract class AuthGateway {
  /** True for the local stand-in, so screens can say that any credentials work. */
  public readonly demo: boolean = false;

  /** Restores a persisted session, if any (`auth.getSession()`). */
  public abstract currentSession(): Promise<AuthSession | null>;

  /** Notifies session changes that happen outside a direct call: token refresh, magic link, OAuth callback (`auth.onAuthStateChange()`). Returns an unsubscribe function. */
  public abstract onSessionChange(listener: (session: AuthSession | null) => void): () => void;

  /** `auth.signInWithPassword()` */
  public abstract signInWithPassword(
    credentials: PasswordCredentials,
  ): Promise<AuthResult<AuthSession>>;

  /** Sends a one-time sign-in link (`auth.signInWithOtp()`). The session arrives later via `onSessionChange`. */
  public abstract signInWithMagicLink(email: string): Promise<AuthResult<null>>;

  /** Starts an OAuth flow (`auth.signInWithOAuth()`). Real providers leave the page and come back with a session. */
  public abstract signInWithOAuth(provider: OAuthProvider): Promise<AuthResult<null>>;

  /** `auth.resetPasswordForEmail()` */
  public abstract sendPasswordReset(email: string): Promise<AuthResult<null>>;

  /** `auth.signOut()` */
  public abstract signOut(): Promise<void>;
}
