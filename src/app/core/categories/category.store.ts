import { computed, Service, signal } from '@angular/core';
import { Category, CategoryId } from '../models/category';
import { DEFAULT_CATEGORIES } from './default-categories';

const FALLBACK_CATEGORY_ID: CategoryId = 'other';

@Service()
export class CategoryStore {
  private readonly _categories = signal<readonly Category[]>(DEFAULT_CATEGORIES);

  public readonly categories = this._categories.asReadonly();

  private readonly _byId = computed(
    () => new Map(this._categories().map((category) => [category.id, category])),
  );

  /** Unknown ids (e.g. a deleted category) resolve to "Otros". */
  public get(id: CategoryId): Category {
    const byId = this._byId();
    const category = byId.get(id) ?? byId.get(FALLBACK_CATEGORY_ID);
    if (!category) throw new Error(`Missing fallback category "${FALLBACK_CATEGORY_ID}"`);
    return category;
  }
}
