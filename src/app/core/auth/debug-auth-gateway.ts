import { DOCUMENT, inject, Service } from '@angular/core';
import type { IsoDateTime } from '../models/dates';
import type { AuthResult, AuthSession, OAuthProvider, PasswordCredentials } from './auth.models';
import { DemoAuthGateway } from './demo-auth-gateway';

const SIGNED_OUT_KEY = 'cc.debug-signed-out';
const DEBUG_SESSION: AuthSession = {
  user: { id: 'debug:alex', email: 'alex.martin@example.com', name: 'Alex Martín' },
  expiresAt: '2999-12-31T23:59:59.000Z' as IsoDateTime,
};

/**
 * TEMPORARY: restores a mock session so the login is skipped while debugging. An explicit sign-out
 * is remembered across reloads until the next sign-in, so the login stays reachable.
 */
@Service({ autoProvided: false })
export class DebugAuthGateway extends DemoAuthGateway {
  private readonly _storage = inject(DOCUMENT).defaultView?.localStorage ?? null;

  public override async currentSession(): Promise<AuthSession | null> {
    return this._signedOut() ? super.currentSession() : DEBUG_SESSION;
  }

  public override async signInWithPassword(
    credentials: PasswordCredentials,
  ): Promise<AuthResult<AuthSession>> {
    this._setSignedOut(false);
    return super.signInWithPassword(credentials);
  }

  public override async signInWithOAuth(provider: OAuthProvider): Promise<AuthResult<null>> {
    this._setSignedOut(false);
    return super.signInWithOAuth(provider);
  }

  public override async signOut(): Promise<void> {
    this._setSignedOut(true);
    await super.signOut();
  }

  private _signedOut(): boolean {
    try {
      return this._storage?.getItem(SIGNED_OUT_KEY) === '1';
    } catch {
      return false;
    }
  }

  private _setSignedOut(value: boolean): void {
    try {
      if (value) this._storage?.setItem(SIGNED_OUT_KEY, '1');
      else this._storage?.removeItem(SIGNED_OUT_KEY);
    } catch {
      // Storage unavailable: fall back to always-mock session.
    }
  }
}
