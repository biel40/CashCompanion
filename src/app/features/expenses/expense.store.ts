import { inject, Service, signal } from '@angular/core';
import { createDemoExpenses } from '../../core/demo/demo-data';
import { Expense } from '../../core/models/expense';
import { Clock } from '../../core/platform/clock';

/** In-memory for now; backed by ExpenseRepository in the persistence phase. */
@Service()
export class ExpenseStore {
  private readonly _clock = inject(Clock);
  private readonly _expenses = signal<readonly Expense[]>(
    createDemoExpenses(this._clock.today(), this._clock.now()),
  );

  public readonly expenses = this._expenses.asReadonly();
}
