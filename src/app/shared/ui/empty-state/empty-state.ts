import { Component, input } from '@angular/core';
import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

@Component({
  selector: 'app-empty-state',
  imports: [Icon],
  template: `
    <div class="badge" aria-hidden="true">
      <app-icon [name]="icon()" [size]="30" />
    </div>
    <h2 class="title">{{ title() }}</h2>
    <p class="text">{{ text() }}</p>
    <ng-content />
  `,
  host: { class: 'card' },
  styles: `
    :host {
      display: grid;
      justify-items: center;
      gap: var(--space-3);
      padding: var(--space-10) var(--space-6);
      text-align: center;
    }
    .badge {
      display: grid;
      place-items: center;
      width: 4.5rem;
      height: 4.5rem;
      margin-bottom: var(--space-2);
      border-radius: var(--radius-card);
      background: var(--accent-lime-bg);
      color: var(--accent-lime-fg);
      rotate: -6deg;
    }
    .title {
      font-size: 1.25rem;
    }
    .text {
      max-width: 30ch;
      color: var(--text-muted);
    }
  `,
})
export class EmptyState {
  public readonly icon = input.required<IconName>();
  public readonly title = input.required<string>();
  public readonly text = input.required<string>();
}
