import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/ui-state/toast.service';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-toast-host',
  imports: [Icon],
  template: `
    <div class="region" role="status" aria-live="polite">
      @if (toasts.current(); as toast) {
        @for (item of [toast]; track item.id) {
          <div class="toast" animate.enter="toast-enter" animate.leave="toast-leave">
            <span class="check"><app-icon name="check" [size]="16" [strokeWidth]="2.6" /></span>
            {{ item.message }}
          </div>
        }
      }
    </div>
  `,
  styles: `
    .region {
      position: fixed;
      inset: calc(var(--safe-top) + var(--space-3)) 0 auto;
      z-index: 20;
      display: grid;
      justify-items: center;
      pointer-events: none;
    }
    @media (min-width: 1024px) {
      .region {
        inset-inline-start: var(--sidebar-width);
        top: var(--space-6);
      }
    }
    .toast {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4) var(--space-2) var(--space-2);
      border-radius: var(--radius-pill);
      background: var(--hero-bg);
      color: var(--hero-fg);
      font-weight: var(--weight-semibold);
      box-shadow: var(--shadow-float);
    }
    .check {
      display: grid;
      place-items: center;
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 50%;
      background: var(--zest);
      color: var(--ink);
    }
    .toast-enter {
      animation: toast-in 380ms var(--ease-spring) both;
    }
    .toast-leave {
      animation: toast-out 180ms var(--ease-in) both;
    }
    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translateY(-16px) scale(0.92);
      }
    }
    @keyframes toast-out {
      to {
        opacity: 0;
        transform: translateY(-8px) scale(0.96);
      }
    }
  `,
})
export class ToastHost {
  protected readonly toasts = inject(ToastService);
}
