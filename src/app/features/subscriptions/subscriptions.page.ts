import { Component } from '@angular/core';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../shared/ui/page-header/page-header';

@Component({
  selector: 'app-subscriptions-page',
  imports: [PageHeader, EmptyState],
  template: `
    <div class="stagger">
      <app-page-header style="--i: 0" title="Suscripciones" />
      <app-empty-state
        style="--i: 1"
        icon="repeat"
        title="Muy pronto"
        text="Aquí verás cuánto te cuestan realmente tus suscripciones al mes y al año."
      />
    </div>
  `,
  styles: `
    .stagger {
      display: grid;
      gap: var(--space-4);
    }
  `,
})
export class SubscriptionsPage {}
