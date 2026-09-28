import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DateFormatter } from '../../core/format/date-formatter';
import { DEFAULT_CURRENCY } from '../../core/models/money';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { BottomSheet } from '../../shared/ui/bottom-sheet/bottom-sheet';
import { Icon } from '../../shared/ui/icon/icon';
import { ThemePicker } from '../../shared/ui/theme-picker/theme-picker';
import { SubscriptionStore } from '../subscriptions/subscription.store';
import { ProfilePanel } from './profile-panel';
import { ProfileStore } from './profile.store';

@Component({
  selector: 'app-profile-sheet',
  imports: [RouterLink, Avatar, BottomSheet, Icon, ThemePicker],
  templateUrl: './profile-sheet.html',
  styleUrl: './profile-sheet.css',
})
export class ProfileSheet {
  private readonly _dates = inject(DateFormatter);
  private readonly _subscriptions = inject(SubscriptionStore);

  protected readonly panel = inject(ProfilePanel);
  protected readonly profile = inject(ProfileStore).profile;
  protected readonly memberSince = computed(() =>
    this._dates.monthYear(this.profile().memberSince),
  );
  protected readonly activeSubscriptions = computed(() => this._subscriptions.active().length);
  protected readonly currency = DEFAULT_CURRENCY;
}
