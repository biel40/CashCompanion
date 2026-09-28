import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => localStorage.clear());

  function create(): ThemeService {
    return TestBed.inject(ThemeService);
  }

  it('follows the system by default', () => {
    const theme = create();
    expect(theme.preference()).toBe('system');
    expect(theme.resolved()).toBe('light');
  });

  it('toggles between light and dark and remembers the choice', () => {
    const theme = create();

    theme.toggle();
    expect(theme.preference()).toBe('dark');
    expect(localStorage.getItem('cc.theme')).toBe('dark');

    theme.toggle();
    expect(theme.resolved()).toBe('light');
  });

  it('applies the resolved theme to the document', () => {
    const theme = create();
    theme.setPreference('dark');
    TestBed.tick();
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });
});
