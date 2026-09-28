import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProfilePanel } from '../../features/profile/profile-panel';
import { ProfileStore } from '../../features/profile/profile.store';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { Icon } from '../../shared/ui/icon/icon';
import { NavTab } from '../nav-tabs';

/** Floating bottom bar on phones and tablets, sidebar on desktop. */
@Component({
  selector: 'app-main-nav',
  imports: [RouterLink, RouterLinkActive, Avatar, Icon],
  template: `
    <a class="brand" routerLink="/" aria-label="CashCompanion, inicio">
      <span class="brand-mark" aria-hidden="true">C</span>
      <span class="brand-name">CashCompanion</span>
    </a>
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
    <button
      type="button"
      class="profile-chip pressable"
      aria-haspopup="dialog"
      (click)="profilePanel.setOpen(true)"
    >
      <app-avatar [name]="profile().name" [color]="profile().color" [size]="40" />
      <span class="profile-text">
        <span class="profile-name">{{ profile().name }}</span>
        <span class="profile-hint">Ver perfil</span>
      </span>
    </button>
  `,
  styleUrl: './main-nav.css',
})
export class MainNav {
  public readonly tabs = input.required<readonly NavTab[]>();
  public readonly activeIndex = input.required<number>();

  protected readonly profilePanel = inject(ProfilePanel);
  protected readonly profile = inject(ProfileStore).profile;
}
