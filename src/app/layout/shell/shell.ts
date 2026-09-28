import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { ProfileSheet } from '../../features/profile/profile-sheet';
import { MainNav } from '../main-nav/main-nav';
import { NAV_TABS } from '../nav-tabs';
import { QuickAdd } from '../quick-add/quick-add';

/** On phones the floating add button would cover these screens; the desktop sidebar always has room. */
const ROUTES_WITHOUT_FLOATING_ADD: readonly string[] = ['/ajustes'];

/** Chrome of the signed-in app: navigation, quick add and profile around the routed pages. */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, MainNav, QuickAdd, ProfileSheet],
  template: `
    <main class="viewport">
      <router-outlet />
    </main>
    <app-main-nav [tabs]="tabs" [activeIndex]="activeIndex()" />
    @if (ready()) {
      <app-quick-add [class.hide-floating]="hideFloatingAdd()" />
    }
    <app-profile-sheet />
  `,
  styles: `
    :host {
      display: block;
      min-height: 100dvh;
    }
    .viewport {
      max-width: var(--app-max-width);
      margin: 0 auto;
      padding: calc(var(--safe-top) + var(--space-4)) var(--gutter)
        calc(var(--nav-height) + var(--safe-bottom) + 6.5rem);
    }
    @media (min-width: 600px) {
      .viewport {
        max-width: var(--tablet-max-width);
        padding-inline: var(--space-8);
      }
    }
    @media (min-width: 1024px) {
      :host {
        padding-inline-start: var(--sidebar-width);
      }
      .viewport {
        max-width: calc(var(--content-max-width) + 2 * var(--space-10));
        padding: var(--space-8) var(--space-10) var(--space-10);
      }
    }
  `,
})
export class Shell {
  private readonly _router = inject(Router);
  private readonly _url = toSignal(
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.split(/[?#]/)[0] ?? '/'),
    ),
    { initialValue: null },
  );

  protected readonly tabs = NAV_TABS;
  protected readonly ready = computed(() => this._url() !== null);
  protected readonly activeIndex = computed(() => {
    const url = this._url();
    if (url === null) return -1;
    return NAV_TABS.findIndex((tab) => (tab.path === '/' ? url === '/' : url.startsWith(tab.path)));
  });
  protected readonly hideFloatingAdd = computed(() =>
    ROUTES_WITHOUT_FLOATING_ADD.includes(this._url() ?? ''),
  );
}
