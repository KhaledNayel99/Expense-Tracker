import { Pipe, PipeTransform } from '@angular/core';
import { ExpenseCategory } from '../models/expense.model';

const ICONS: Record<ExpenseCategory, string> = {
  Food: '🍔',
  Transport: '🚗',
  Shopping: '🛍️',
  Bills: '💡',
  Entertainment: '🎬',
  Other: '📦'
};

/**
 * Custom pipe: prefixes a category name with a matching emoji.
 * e.g. 'Food' -> '🍔 Food'
 */
@Pipe({
  name: 'categoryIcon',
  standalone: true
})
export class CategoryIconPipe implements PipeTransform {
  transform(category: ExpenseCategory): string {
    const icon = ICONS[category] ?? '📦';
    return `${icon} ${category}`;
  }
}
