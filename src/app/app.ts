import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { BottomNav } from './layout/bottom-nav/bottom-nav';
import { NAV_TABS } from './layout/nav-tabs';
import { QuickAdd } from './layout/quick-add/quick-add';
import { ToastHost } from './shared/ui/toast/toast-host';

const ROUTES_WITHOUT_QUICK_ADD: readonly string[] = ['/ajustes'];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomNav, QuickAdd, ToastHost],
  template: `
    <main class="viewport">
      <router-outlet />
    </main>
    @if (showQuickAdd()) {
      <app-quick-add />
    }
    <app-bottom-nav [tabs]="tabs" [activeIndex]="activeIndex()" />
    <app-toast-host />
  `,
  styles: `
    :host {
      display: block;
      min-height: 100dvh;
    }
    .viewport {
      min-height: 100dvh;
      max-width: var(--app-max-width);
      margin: 0 auto;
      padding: calc(var(--safe-top) + var(--space-4)) var(--gutter)
        calc(var(--nav-height) + var(--safe-bottom) + 6.5rem);
      background: var(--bg);
    }
    @media (min-width: 600px) {
      .viewport {
        box-shadow: 0 0 0 1px var(--hairline);
      }
    }
  `,
})
export class App {
  private readonly _router = inject(Router);
  private readonly _url = toSignal(
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.split(/[?#]/)[0] ?? '/'),
    ),
    { initialValue: null },
  );

  protected readonly tabs = NAV_TABS;
  protected readonly activeIndex = computed(() => {
    const url = this._url();
    if (url === null) return -1;
    return NAV_TABS.findIndex((tab) => (tab.path === '/' ? url === '/' : url.startsWith(tab.path)));
  });
  protected readonly showQuickAdd = computed(() => {
    const url = this._url();
    return url !== null && !ROUTES_WITHOUT_QUICK_ADD.includes(url);
  });
}
