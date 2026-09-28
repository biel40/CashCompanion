import { Component, inject } from '@angular/core';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { Icon } from '../../shared/ui/icon/icon';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { ThemePicker } from '../../shared/ui/theme-picker/theme-picker';
import { ProfilePanel } from '../profile/profile-panel';
import { ProfileStore } from '../profile/profile.store';

@Component({
  selector: 'app-settings-page',
  imports: [Avatar, Icon, PageHeader, ThemePicker],
  template: `
    <div class="stagger">
      <app-page-header style="--i: 0" title="Ajustes" />

      <button
        type="button"
        class="card pressable profile"
        style="--i: 1"
        aria-haspopup="dialog"
        (click)="profilePanel.setOpen(true)"
      >
        <app-avatar [name]="profile().name" [color]="profile().color" [size]="52" />
        <span class="profile-text">
          <span class="name">{{ profile().name }}</span>
          <span class="email">{{ profile().email }}</span>
        </span>
        <app-icon class="chevron" name="chevron-right" [size]="20" />
      </button>

      <section class="card" style="--i: 2">
        <app-theme-picker />
      </section>
    </div>
  `,
  styles: `
    .stagger {
      display: grid;
      gap: var(--space-4);
      max-width: 40rem;
    }
    .profile {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      width: 100%;
      border: 0;
      color: inherit;
      text-align: start;
    }
    .profile-text {
      display: grid;
      flex: 1;
      min-width: 0;
    }
    .name {
      font-size: var(--text-card-title);
      font-weight: var(--weight-semibold);
    }
    .email {
      overflow: hidden;
      color: var(--text-muted);
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .chevron {
      color: var(--text-subtle);
    }
    @media (hover: hover) {
      .profile:hover {
        box-shadow: var(--shadow-float);
      }
    }
  `,
})
export class SettingsPage {
  protected readonly profilePanel = inject(ProfilePanel);
  protected readonly profile = inject(ProfileStore).profile;
}
