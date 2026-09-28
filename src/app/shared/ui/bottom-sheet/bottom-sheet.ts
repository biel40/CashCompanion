import { Component, ElementRef, effect, input, model, viewChild } from '@angular/core';

/**
 * Bottom sheet built on the native <dialog>: focus trapping, Escape and top-layer come for free.
 * Open/close animations are CSS-only (@starting-style + allow-discrete).
 */
@Component({
  selector: 'app-bottom-sheet',
  template: `
    <dialog
      #dialog
      class="sheet"
      [attr.aria-labelledby]="labelId()"
      (close)="open.set(false)"
      (click)="closeOnBackdrop($event)"
    >
      <div class="grabber" aria-hidden="true"></div>
      <ng-content />
    </dialog>
  `,
  styleUrl: './bottom-sheet.css',
})
export class BottomSheet {
  private readonly _dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  public readonly open = model(false);
  public readonly labelId = input.required<string>();

  public constructor() {
    effect(() => {
      const dialog = this._dialog().nativeElement;
      if (this.open() && !dialog.open) dialog.showModal();
      if (!this.open() && dialog.open) dialog.close();
    });
  }

  protected closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this._dialog().nativeElement) this.open.set(false);
  }
}
