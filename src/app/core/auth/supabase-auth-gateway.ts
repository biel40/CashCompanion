import { DOCUMENT, inject, Service } from '@angular/core';
import { isAuthRetryableFetchError } from '@supabase/supabase-js';
import type { AuthError, Session } from '@supabase/supabase-js';
import type { IsoDateTime } from '../models/dates';
import { displayNameFromEmail } from '../domain/names';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthGateway } from './auth-gateway';
import type {
  AuthErrorCode,
  AuthResult,
  AuthSession,
  OAuthProvider,
  PasswordCredentials,
} from './auth.models';

/** Real backend: maps `supabase.auth.*` onto the provider-agnostic {@link AuthGateway}. */
@Service({ autoProvided: false })
export class SupabaseAuthGateway extends AuthGateway {
  private readonly _auth = inject(SupabaseService).client.auth;
  private readonly _document = inject(DOCUMENT);

  public override async currentSession(): Promise<AuthSession | null> {
    const { data } = await this._auth.getSession();
    return this._toSession(data.session);
  }

  public override onSessionChange(listener: (session: AuthSession | null) => void): () => void {
    const { data } = this._auth.onAuthStateChange((_event: string, session: Session | null) =>
      listener(this._toSession(session)),
    );
    return () => data.subscription.unsubscribe();
  }

  public override async signInWithPassword(
    credentials: PasswordCredentials,
  ): Promise<AuthResult<AuthSession>> {
    const { data, error } = await this._auth.signInWithPassword(credentials);
    const session = this._toSession(data.session);
    if (error !== null || session === null) return { ok: false, error: this._mapError(error) };
    return { ok: true, data: session };
  }

  public override async signInWithMagicLink(email: string): Promise<AuthResult<null>> {
    const { error } = await this._auth.signInWithOtp({
      email,
      options: { emailRedirectTo: this._origin() },
    });
    return this._void(error);
  }

  public override async signInWithOAuth(provider: OAuthProvider): Promise<AuthResult<null>> {
    const { error } = await this._auth.signInWithOAuth({
      provider,
      options: { redirectTo: this._origin() },
    });
    return this._void(error);
  }

  public override async sendPasswordReset(email: string): Promise<AuthResult<null>> {
    const { error } = await this._auth.resetPasswordForEmail(email, {
      redirectTo: this._origin(),
    });
    return this._void(error);
  }

  public override async signOut(): Promise<void> {
    await this._auth.signOut();
  }

  private _origin(): string | undefined {
    return this._document.defaultView?.location.origin;
  }

  private _void(error: AuthError | null): AuthResult<null> {
    return error === null ? { ok: true, data: null } : { ok: false, error: this._mapError(error) };
  }

  private _toSession(session: Session | null): AuthSession | null {
    if (session === null) return null;
    const { user } = session;
    const email = user.email ?? '';
    const metadata = user.user_metadata as Record<string, unknown>;
    const fullName = metadata['full_name'] ?? metadata['name'];
    return {
      user: {
        id: user.id,
        email,
        name:
          typeof fullName === 'string' && fullName !== '' ? fullName : displayNameFromEmail(email),
      },
      expiresAt: new Date((session.expires_at ?? 0) * 1000).toISOString() as IsoDateTime,
    };
  }

  private _mapError(error: AuthError | null): AuthErrorCode {
    if (error === null) return 'unknown';
    if (isAuthRetryableFetchError(error)) return 'network';
    switch (error.code) {
      case 'invalid_credentials':
        return 'invalid_credentials';
      case 'email_not_confirmed':
        return 'email_not_confirmed';
      case 'over_request_rate_limit':
      case 'over_email_send_rate_limit':
        return 'rate_limited';
      default:
        return 'unknown';
    }
  }
}
