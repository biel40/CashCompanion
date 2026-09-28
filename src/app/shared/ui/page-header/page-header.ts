import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <h1 class="title">{{ title() }}</h1>
    @if (subtitle(); as subtitle) {
      <p class="subtitle">{{ subtitle }}</p>
    }
  `,
  styles: `
    :host {
      display: block;
      padding: var(--space-4) var(--space-1) var(--space-2);
    }
    .title {
      font-size: var(--text-display);
      letter-spacing: var(--tracking-tight);
    }
    .subtitle {
      margin-top: var(--space-1);
      color: var(--text-muted);
      font-size: 1.0625rem;
      font-weight: var(--weight-medium);
    }
  `,
})
export class PageHeader {
  public readonly title = input.required<string>();
  public readonly subtitle = input<string>();
}
