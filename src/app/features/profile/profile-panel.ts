import { Service, signal } from '@angular/core';

/** Whether the profile sheet is open. It can be opened from Home, the sidebar and Settings. */
@Service()
export class ProfilePanel {
  private readonly _open = signal(false);

  public readonly open = this._open.asReadonly();

  public setOpen(open: boolean): void {
    this._open.set(open);
  }
}
