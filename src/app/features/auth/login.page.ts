import { Component, computed, inject, input, signal } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { safeRedirect } from '../../core/auth/auth.guards';
import type { AuthErrorCode, OAuthProvider } from '../../core/auth/auth.models';
import { AuthStore } from '../../core/auth/auth.store';
import { ToastService } from '../../core/ui-state/toast.service';
import { Icon } from '../../shared/ui/icon/icon';
import { ThemeToggle } from '../../shared/ui/theme-toggle/theme-toggle';
import { LoginShowcase } from './components/login-showcase';

export type LoginMode = 'password' | 'magic-link';

interface LoginModel {
  email: string;
  password: string;
}

interface ModeOption {
  readonly value: LoginMode;
  readonly label: string;
}

const MODES: readonly ModeOption[] = [
  { value: 'password', label: 'Contraseña' },
  { value: 'magic-link', label: 'Enlace mágico' },
];

const MIN_PASSWORD_LENGTH = 6;
const DEMO_CREDENTIALS: LoginModel = { email: 'alex.martin@example.com', password: 'demo-demo' };

const ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  invalid_credentials: 'El correo o la contraseña no coinciden.',
  email_not_confirmed: 'Confirma tu correo desde el enlace que te enviamos antes de entrar.',
  rate_limited: 'Demasiados intentos. Espera un minuto y vuelve a probar.',
  network: 'No hay conexión. Revisa tu red e inténtalo de nuevo.',
  unknown: 'Algo ha fallado. Inténtalo de nuevo.',
};

@Component({
  selector: 'app-login-page',
  imports: [FormField, FormRoot, Icon, ThemeToggle, LoginShowcase],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  private readonly _auth = inject(AuthStore);
  private readonly _router = inject(Router);
  private readonly _toasts = inject(ToastService);
  private readonly _model = signal<LoginModel>({ email: '', password: '' });

  /** Where to go after signing in; bound from `?redirect=` by the router. */
  public readonly redirect = input<string>('');

  protected readonly modes = MODES;
  protected readonly isDemo = this._auth.isDemo;
  protected readonly mode = signal<LoginMode>('password');
  protected readonly modeIndex = computed(() => MODES.findIndex((m) => m.value === this.mode()));
  protected readonly passwordVisible = signal<boolean>(false);
  protected readonly authError = signal<string | null>(null);
  protected readonly magicLinkSentTo = signal<string | null>(null);
  protected readonly pendingProvider = signal<OAuthProvider | null>(null);
  protected readonly sendingReset = signal<boolean>(false);

  protected readonly loginForm = form(
    this._model,
    (path) => {
      const usesPassword = (): boolean => this.mode() === 'password';
      required(path.email, { message: 'Escribe tu correo electrónico.' });
      email(path.email, { message: 'Ese correo no parece válido.' });
      required(path.password, { message: 'Escribe tu contraseña.', when: usesPassword });
      minLength(path.password, MIN_PASSWORD_LENGTH, {
        message: `La contraseña tiene al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
        when: usesPassword,
      });
    },
    {
      submission: {
        action: async () => this._submit(),
        onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
      },
    },
  );

  protected readonly emailError = computed(() => this._visibleError(this.loginForm.email));
  protected readonly passwordError = computed(() => this._visibleError(this.loginForm.password));
  protected readonly busy = computed(
    () => this.loginForm().submitting() || this.pendingProvider() !== null,
  );
  protected readonly submitLabel = computed(() =>
    this.mode() === 'password' ? 'Entrar' : 'Enviarme el enlace',
  );

  protected setMode(mode: LoginMode): void {
    this.mode.set(mode);
    this.authError.set(null);
  }

  protected async continueWith(provider: OAuthProvider): Promise<void> {
    this.authError.set(null);
    this.pendingProvider.set(provider);
    const error = await this._auth.signInWithOAuth(provider);
    this.pendingProvider.set(null);
    await this._finish(error);
  }

  protected async sendPasswordReset(): Promise<void> {
    const emailField = this.loginForm.email();
    if (emailField.invalid()) {
      emailField.markAsTouched();
      emailField.focusBoundControl();
      return;
    }
    this.sendingReset.set(true);
    const error = await this._auth.sendPasswordReset(emailField.value());
    this.sendingReset.set(false);
    if (error) this.authError.set(ERROR_MESSAGES[error]);
    else this._toasts.show('Te hemos enviado un correo para cambiarla');
  }

  protected async enterDemo(): Promise<void> {
    this.mode.set('password');
    this._model.set(DEMO_CREDENTIALS);
    this.authError.set(null);
    await this._finish(await this._auth.signInWithPassword(DEMO_CREDENTIALS));
  }

  protected useAnotherEmail(): void {
    this.magicLinkSentTo.set(null);
  }

  private async _submit(): Promise<undefined> {
    this.authError.set(null);
    const { email: address, password } = this._model();
    if (this.mode() === 'magic-link') {
      const error = await this._auth.signInWithMagicLink(address);
      if (error) this.authError.set(ERROR_MESSAGES[error]);
      else this.magicLinkSentTo.set(address);
      return undefined;
    }
    await this._finish(await this._auth.signInWithPassword({ email: address, password }));
    return undefined;
  }

  /** Enters the app when a session exists; real OAuth providers navigate away before this point. */
  private async _finish(error: AuthErrorCode | null): Promise<void> {
    if (error) {
      this.authError.set(ERROR_MESSAGES[error]);
      return;
    }
    if (this._auth.isAuthenticated()) {
      await this._router.navigateByUrl(safeRedirect(this.redirect()), { replaceUrl: true });
    }
  }

  private _visibleError(field: FieldTree<string>): string | null {
    const state = field();
    if (!state.touched() || !state.invalid()) return null;
    return state.errors()[0]?.message ?? null;
  }
}
