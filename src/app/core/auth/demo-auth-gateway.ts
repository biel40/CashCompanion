import { DOCUMENT, inject, Service } from '@angular/core';
import { displayNameFromEmail } from '../domain/names';
import type { IsoDateTime } from '../models/dates';
import { Clock } from '../platform/clock';
import { AuthGateway } from './auth-gateway';
import type { AuthResult, AuthSession, OAuthProvider, PasswordCredentials } from './auth.models';

const STORAGE_KEY = 'cc.session';
const LATENCY_MS = 650;
const SESSION_MS = 30 * 86_400_000;
const OAUTH_DEMO_USER: Record<OAuthProvider, { readonly email: string; readonly name: string }> = {
  google: { email: 'alex.martin@gmail.com', name: 'Alex Martín' },
  apple: { email: 'alex.martin@icloud.com', name: 'Alex Martín' },
};

/**
 * Local stand-in until Supabase is wired: accepts any well-formed credentials, simulates network
 * latency and keeps the session in localStorage. Never ship it to production.
 */
@Service({ autoProvided: false })
export class DemoAuthGateway extends AuthGateway {
  private readonly _document = inject(DOCUMENT);
  private readonly _clock = inject(Clock);
  private readonly _listeners = new Set<(session: AuthSession | null) => void>();

  public override readonly demo: boolean = true;

  public override async currentSession(): Promise<AuthSession | null> {
    const session = this._read();
    if (session === null || session.expiresAt <= this._clock.now()) return null;
    return session;
  }

  public override onSessionChange(listener: (session: AuthSession | null) => void): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  public override async signInWithPassword(
    credentials: PasswordCredentials,
  ): Promise<AuthResult<AuthSession>> {
    await this._latency();
    return { ok: true, data: this._start(credentials.email, null) };
  }

  public override async signInWithMagicLink(_email: string): Promise<AuthResult<null>> {
    await this._latency();
    return { ok: true, data: null };
  }

  public override async signInWithOAuth(provider: OAuthProvider): Promise<AuthResult<null>> {
    await this._latency();
    const user = OAUTH_DEMO_USER[provider];
    this._emit(this._start(user.email, user.name));
    return { ok: true, data: null };
  }

  public override async sendPasswordReset(_email: string): Promise<AuthResult<null>> {
    await this._latency();
    return { ok: true, data: null };
  }

  public override async signOut(): Promise<void> {
    this._write(null);
    this._emit(null);
  }

  private _start(email: string, name: string | null): AuthSession {
    const normalized = email.trim().toLowerCase();
    const session: AuthSession = {
      user: {
        id: `demo:${normalized}`,
        email: normalized,
        name: name ?? displayNameFromEmail(normalized),
      },
      expiresAt: new Date(Date.parse(this._clock.now()) + SESSION_MS).toISOString() as IsoDateTime,
    };
    this._write(session);
    return session;
  }

  private _emit(session: AuthSession | null): void {
    for (const listener of this._listeners) listener(session);
  }

  private _latency(): Promise<void> {
    return new Promise((resolve: () => void) => setTimeout(resolve, LATENCY_MS));
  }

  private _read(): AuthSession | null {
    try {
      const raw = this._document.defaultView?.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthSession) : null;
    } catch {
      return null;
    }
  }

  private _write(session: AuthSession | null): void {
    try {
      const storage = this._document.defaultView?.localStorage;
      if (session === null) storage?.removeItem(STORAGE_KEY);
      else storage?.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Storage unavailable (private mode): the session lasts until reload.
    }
  }
}
