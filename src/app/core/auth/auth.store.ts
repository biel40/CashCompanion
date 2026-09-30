import { computed, DestroyRef, inject, Service, signal } from '@angular/core';
import { AuthGateway } from './auth-gateway';
import type {
  AuthErrorCode,
  AuthSession,
  AuthUser,
  OAuthProvider,
  PasswordCredentials,
} from './auth.models';

/** Session state for the whole app. Screens call these methods; only the gateway knows the backend. */
@Service()
export class AuthStore {
  private readonly _gateway = inject(AuthGateway);
  private readonly _session = signal<AuthSession | null>(null);

  public readonly isDemo: boolean = this._gateway.demo;
  public readonly session = this._session.asReadonly();
  public readonly user = computed<AuthUser | null>(() => this._session()?.user ?? null);
  public readonly isAuthenticated = computed<boolean>(() => this._session() !== null);

  public constructor() {
    const unsubscribe = this._gateway.onSessionChange((session: AuthSession | null) =>
      this._session.set(session),
    );
    inject(DestroyRef).onDestroy(unsubscribe);
  }

  /** Runs once before the first navigation so guards see a restored session. */
  public async restore(): Promise<void> {
    this._session.set(await this._gateway.currentSession());
  }

  public async signInWithPassword(credentials: PasswordCredentials): Promise<AuthErrorCode | null> {
    const result = await this._gateway.signInWithPassword(credentials);
    if (!result.ok) return result.error;
    this._session.set(result.data);
    return null;
  }

  public async signInWithMagicLink(email: string): Promise<AuthErrorCode | null> {
    const result = await this._gateway.signInWithMagicLink(email);
    return result.ok ? null : result.error;
  }

  public async signInWithOAuth(provider: OAuthProvider): Promise<AuthErrorCode | null> {
    const result = await this._gateway.signInWithOAuth(provider);
    return result.ok ? null : result.error;
  }

  public async sendPasswordReset(email: string): Promise<AuthErrorCode | null> {
    const result = await this._gateway.sendPasswordReset(email);
    return result.ok ? null : result.error;
  }

  public async signOut(): Promise<void> {
    await this._gateway.signOut();
    this._session.set(null);
  }
}
