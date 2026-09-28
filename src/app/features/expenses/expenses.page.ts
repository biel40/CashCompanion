import { Component } from '@angular/core';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../shared/ui/page-header/page-header';

@Component({
  selector: 'app-expenses-page',
  imports: [PageHeader, EmptyState],
  template: `
    <div class="stagger">
      <app-page-header style="--i: 0" title="Gastos" />
      <app-empty-state
        style="--i: 1"
        icon="receipt"
        title="Muy pronto"
        text="Aquí verás tus gastos del mes agrupados por día."
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
export class ExpensesPage {}
