import { computed, Service, signal } from '@angular/core';
import { IsoDate } from '../../core/models/dates';
import { UserProfile } from '../../core/models/profile';

const DEMO_PROFILE: UserProfile = {
  id: 'demo-user',
  name: 'Alex Martín',
  email: 'alex.martin@example.com',
  memberSince: '2024-01-12' as IsoDate,
  color: 'violet',
};

/** Mocked for now; backed by a ProfileRepository once there is persistence or a backend. */
@Service()
export class ProfileStore {
  private readonly _profile = signal<UserProfile>(DEMO_PROFILE);

  public readonly profile = this._profile.asReadonly();
  public readonly firstName = computed(() => this._profile().name.trim().split(/\s+/)[0] ?? '');
}
