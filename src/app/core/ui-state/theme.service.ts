import { computed, DOCUMENT, effect, inject, Service, signal } from '@angular/core';
import { ResolvedTheme, ThemePreference } from '../models/settings';

const STORAGE_KEY = 'cc.theme';
const THEME_COLORS: Record<ResolvedTheme, string> = { light: '#F5F4EF', dark: '#0D0E12' };

@Service()
export class ThemeService {
  private readonly _document = inject(DOCUMENT);
  private readonly _darkQuery = this._document.defaultView?.matchMedia?.(
    '(prefers-color-scheme: dark)',
  );
  private readonly _systemDark = signal(this._darkQuery?.matches ?? false);
  private readonly _preference = signal<ThemePreference>(this._readPreference());

  public readonly preference = this._preference.asReadonly();
  public readonly resolved = computed<ResolvedTheme>(() => {
    const preference = this._preference();
    if (preference !== 'system') return preference;
    return this._systemDark() ? 'dark' : 'light';
  });

  public constructor() {
    this._darkQuery?.addEventListener('change', (event) => this._systemDark.set(event.matches));
    effect(() => this._apply(this.resolved()));
  }

  public setPreference(preference: ThemePreference): void {
    this._preference.set(preference);
    this._writePreference(preference);
  }

  public toggle(): void {
    this.setPreference(this.resolved() === 'dark' ? 'light' : 'dark');
  }

  private _apply(theme: ResolvedTheme): void {
    this._document.documentElement.dataset['theme'] = theme;
    this._document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLORS[theme]);
  }

  // Temporary until the persistence phase moves this behind SettingsRepository.
  // index.html reads the same key before Angular boots to avoid a theme flash.
  private _readPreference(): ThemePreference {
    try {
      const stored = this._document.defaultView?.localStorage.getItem(STORAGE_KEY);
      return stored === 'light' || stored === 'dark' ? stored : 'system';
    } catch {
      return 'system';
    }
  }

  private _writePreference(preference: ThemePreference): void {
    try {
      this._document.defaultView?.localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // Storage unavailable (private mode): the choice lasts for this session only.
    }
  }
}
