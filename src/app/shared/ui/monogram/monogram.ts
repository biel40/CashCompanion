import { Component, computed, input } from '@angular/core';
import { AccentColor } from '../../../core/models/accent';
import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

/** Coloured tile showing an icon, or the first letter of a name when no icon is given. */
@Component({
  selector: 'app-monogram',
  imports: [Icon],
  template: `
    @if (icon(); as icon) {
      <app-icon [name]="icon" [size]="iconSize()" />
    } @else {
      {{ letter() }}
    }
  `,
  host: {
    'aria-hidden': 'true',
    '[style.--tile-bg]': 'background()',
    '[style.--tile-fg]': 'foreground()',
    '[style.--tile-size]': 'tileSize()',
  },
  styles: `
    :host {
      display: inline-grid;
      place-items: center;
      flex: none;
      width: var(--tile-size);
      height: var(--tile-size);
      border-radius: calc(var(--tile-size) * 0.32);
      background: var(--tile-bg);
      color: var(--tile-fg);
      font-size: calc(var(--tile-size) * 0.44);
      font-weight: var(--weight-bold);
      line-height: 1;
    }
  `,
})
export class Monogram {
  public readonly name = input<string>('');
  public readonly color = input<AccentColor>('slate');
  public readonly icon = input<IconName | undefined>(undefined);
  public readonly size = input<number>(44);

  protected readonly letter = computed(() => this.name().trim().charAt(0).toUpperCase());
  protected readonly tileSize = computed(() => `${this.size()}px`);
  protected readonly iconSize = computed(() => Math.round(this.size() * 0.5));
  protected readonly background = computed(() => `var(--accent-${this.color()}-bg)`);
  protected readonly foreground = computed(() => `var(--accent-${this.color()}-fg)`);
}
