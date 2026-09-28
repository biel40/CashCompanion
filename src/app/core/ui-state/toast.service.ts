import { Service, signal } from '@angular/core';

export interface Toast {
  readonly id: number;
  readonly message: string;
}

const TOAST_DURATION_MS = 2600;

@Service()
export class ToastService {
  private readonly _current = signal<Toast | null>(null);
  private _nextId = 0;
  private _timer: ReturnType<typeof setTimeout> | undefined;

  public readonly current = this._current.asReadonly();

  public show(message: string): void {
    clearTimeout(this._timer);
    this._current.set({ id: this._nextId++, message });
    this._timer = setTimeout(() => this._current.set(null), TOAST_DURATION_MS);
  }
}
