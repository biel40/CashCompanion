import { TestBed } from '@angular/core/testing';
import type { IsoDateTime } from '../models/dates';
import { AuthGateway } from './auth-gateway';
import { safeRedirect } from './auth.guards';
import type { AuthResult, AuthSession, PasswordCredentials } from './auth.models';
import { AuthStore } from './auth.store';

const SESSION: AuthSession = {
  user: { id: 'u1', email: 'ana@example.com', name: 'Ana' },
  expiresAt: '2026-12-31T00:00:00.000Z' as IsoDateTime,
};

class FakeAuthGateway extends AuthGateway {
  public stored: AuthSession | null = null;
  public passwordResult: AuthResult<AuthSession> = { ok: true, data: SESSION };
  private _listener: ((session: AuthSession | null) => void) | null = null;

  public override async currentSession(): Promise<AuthSession | null> {
    return this.stored;
  }
  public override onSessionChange(listener: (session: AuthSession | null) => void): () => void {
    this._listener = listener;
    return () => (this._listener = null);
  }
  public override async signInWithPassword(
    _credentials: PasswordCredentials,
  ): Promise<AuthResult<AuthSession>> {
    return this.passwordResult;
  }
  public override async signInWithMagicLink(_email: string): Promise<AuthResult<null>> {
    return { ok: true, data: null };
  }
  public override async signInWithOAuth(): Promise<AuthResult<null>> {
    this._listener?.(SESSION);
    return { ok: true, data: null };
  }
  public override async sendPasswordReset(_email: string): Promise<AuthResult<null>> {
    return { ok: true, data: null };
  }
  public override async signOut(): Promise<void> {
    this._listener?.(null);
  }
}

describe('AuthStore', () => {
  let gateway: FakeAuthGateway;

  function create(): AuthStore {
    gateway = new FakeAuthGateway();
    TestBed.configureTestingModule({ providers: [{ provide: AuthGateway, useValue: gateway }] });
    return TestBed.inject(AuthStore);
  }

  it('restores a persisted session', async () => {
    const auth = create();
    gateway.stored = SESSION;
    await auth.restore();
    expect(auth.isAuthenticated()).toBe(true);
    expect(auth.user()?.email).toBe('ana@example.com');
  });

  it('signs in with a password and reports failures', async () => {
    const auth = create();
    gateway.passwordResult = { ok: false, error: 'invalid_credentials' };
    expect(await auth.signInWithPassword({ email: 'a@b.c', password: 'x' })).toBe(
      'invalid_credentials',
    );
    expect(auth.isAuthenticated()).toBe(false);

    gateway.passwordResult = { ok: true, data: SESSION };
    expect(await auth.signInWithPassword({ email: 'a@b.c', password: 'secret' })).toBeNull();
    expect(auth.isAuthenticated()).toBe(true);
  });

  it('follows sessions pushed by the gateway and signs out', async () => {
    const auth = create();
    await auth.signInWithOAuth('google');
    expect(auth.isAuthenticated()).toBe(true);

    await auth.signOut();
    expect(auth.session()).toBeNull();
  });
});

describe('safeRedirect', () => {
  it('keeps in-app paths', () => {
    expect(safeRedirect('/gastos?mes=9')).toBe('/gastos?mes=9');
  });

  it('falls back to home for empty, external or login targets', () => {
    expect(safeRedirect('')).toBe('/');
    expect(safeRedirect(undefined)).toBe('/');
    expect(safeRedirect('https://evil.example')).toBe('/');
    expect(safeRedirect('//evil.example')).toBe('/');
    expect(safeRedirect('/login?redirect=/')).toBe('/');
  });
});
