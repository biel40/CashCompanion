import { Component, inject, signal } from '@angular/core';
import { ToastService } from '../../core/ui-state/toast.service';
import { BottomSheet } from '../../shared/ui/bottom-sheet/bottom-sheet';
import { Icon } from '../../shared/ui/icon/icon';
import { IconName } from '../../shared/ui/icon/icons';

interface QuickAction {
  readonly id: 'expense' | 'subscription';
  readonly label: string;
  readonly hint: string;
  readonly icon: IconName;
}

@Component({
  selector: 'app-quick-add',
  imports: [BottomSheet, Icon],
  templateUrl: './quick-add.html',
  styleUrl: './quick-add.css',
})
export class QuickAdd {
  private readonly _toasts = inject(ToastService);

  protected readonly open = signal(false);
  protected readonly actions: readonly QuickAction[] = [
    {
      id: 'expense',
      label: 'Añadir gasto',
      hint: 'Una compra, una cena, gasolina…',
      icon: 'receipt',
    },
    {
      id: 'subscription',
      label: 'Añadir suscripción',
      hint: 'Algo que pagas cada mes o cada año',
      icon: 'repeat',
    },
  ];

  protected choose(action: QuickAction): void {
    this.open.set(false);
    // Forms arrive with the Expenses and Subscriptions phases.
    this._toasts.show(`${action.label}: muy pronto`);
  }
}
