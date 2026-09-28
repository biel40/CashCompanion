import { computed, inject, Service } from '@angular/core';
import { AuthStore } from '../../core/auth/auth.store';
import { IsoDate } from '../../core/models/dates';
import { UserProfile } from '../../core/models/profile';

const DEMO_PROFILE: UserProfile = {
  id: 'demo-user',
  name: 'Alex Martín',
  email: 'alex.martin@example.com',
  memberSince: '2024-01-12' as IsoDate,
  color: 'violet',
};

/** Identity comes from the session; the rest stays mocked until profiles live in Supabase. */
@Service()
export class ProfileStore {
  private readonly _auth = inject(AuthStore);

  public readonly profile = computed<UserProfile>(() => {
    const user = this._auth.user();
    if (user === null) return DEMO_PROFILE;
    return { ...DEMO_PROFILE, id: user.id, email: user.email, name: user.name ?? user.email };
  });
  public readonly firstName = computed<string>(
    () => this.profile().name.trim().split(/\s+/)[0] ?? '',
  );
}
