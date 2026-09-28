import { Component, computed, input } from '@angular/core';
import { AccentColor } from '../../../core/models/accent';

/** Round avatar with the person's initials. */
@Component({
  selector: 'app-avatar',
  template: `{{ initials() }}`,
  host: {
    'aria-hidden': 'true',
    '[style.--avatar-size]': 'sizePx()',
    '[style.--avatar-bg]': 'background()',
    '[style.--avatar-fg]': 'foreground()',
  },
  styles: `
    :host {
      display: inline-grid;
      place-items: center;
      flex: none;
      width: var(--avatar-size);
      height: var(--avatar-size);
      border-radius: 50%;
      background: var(--avatar-bg);
      color: var(--avatar-fg);
      font-size: calc(var(--avatar-size) * 0.38);
      font-weight: var(--weight-bold);
      letter-spacing: 0.02em;
      line-height: 1;
    }
  `,
})
export class Avatar {
  public readonly name = input.required<string>();
  public readonly color = input<AccentColor>('violet');
  public readonly size = input<number>(44);

  protected readonly initials = computed(() =>
    this.name()
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join(''),
  );
  protected readonly sizePx = computed(() => `${this.size()}px`);
  protected readonly background = computed(() => `var(--accent-${this.color()}-bg)`);
  protected readonly foreground = computed(() => `var(--accent-${this.color()}-fg)`);
}
