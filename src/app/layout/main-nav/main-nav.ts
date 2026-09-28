import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '../../shared/ui/icon/icon';
import { NavTab } from '../nav-tabs';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive, Icon],
  template: `
    <nav class="bar" aria-label="Principal" [style.--active]="activeIndex()">
      @if (activeIndex() >= 0) {
        <span class="indicator" aria-hidden="true"></span>
      }
      @for (tab of tabs(); track tab.path) {
        <a
          class="tab pressable"
          [routerLink]="tab.path"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: tab.path === '/' }"
          ariaCurrentWhenActive="page"
        >
          <app-icon [name]="tab.icon" [size]="22" />
          <span class="label">{{ tab.label }}</span>
        </a>
      }
    </nav>
  `,
  styleUrl: './bottom-nav.css',
})
export class BottomNav {
  public readonly tabs = input.required<readonly NavTab[]>();
  public readonly activeIndex = input.required<number>();
}
