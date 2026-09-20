import { Injectable, inject } from '@angular/core';
import { ExpenseService } from './expense.service';
import { Expense, EXPENSE_CATEGORIES } from '../models/expense.model';


@Injectable({ providedIn: 'root' })
export class AiChatbotService {
  private expenseService = inject(ExpenseService);

  async getResponse(message: string): Promise<string> {
    await this.delay(350 + Math.random() * 350); // simulate "thinking"

    const text = message.toLowerCase().trim();
    const expenses = this.expenseService.expenses();

    if (expenses.length === 0) {
      return "You don't have any expenses recorded yet. Try adding one from the \"Add Expense\" page!";
    }

    const category = this.matchCategory(text);

    if (/total|how much.*spent|spend(ing)?|sum/.test(text)) {
      const filtered = category ? expenses.filter((e) => e.category === category) : expenses;
      const total = filtered.reduce((sum, e) => sum + e.amount, 0);
      return category
        ? `You've spent a total of ${this.currency(total)} on ${category}.`
        : `Your total spending across all ${expenses.length} expense(s) is ${this.currency(total)}.`;
    }

    if (/highest|biggest|largest|most expensive/.test(text)) {
      const max = [...expenses].sort((a, b) => b.amount - a.amount)[0];
      return `Your largest expense is ${this.currency(max.amount)} for ${max.category} on ${max.date}${
        max.note ? ` ("${max.note}")` : ''
      }.`;
    }

    if (/lowest|smallest|cheapest/.test(text)) {
      const min = [...expenses].sort((a, b) => a.amount - b.amount)[0];
      return `Your smallest expense is ${this.currency(min.amount)} for ${min.category} on ${min.date}.`;
    }

    if (/how many/.test(text)) {
      const filtered = category ? expenses.filter((e) => e.category === category) : expenses;
      return category
        ? `You have ${filtered.length} expense(s) in ${category}.`
        : `You have ${expenses.length} expense(s) recorded in total.`;
    }

    if (/average|avg/.test(text)) {
      const total = expenses.reduce((sum, e) => sum + e.amount, 0);
      return `Your average expense is ${this.currency(total / expenses.length)} across ${expenses.length} expense(s).`;
    }

    if (/breakdown|by category|categories/.test(text)) {
      const byCategory = new Map<string, number>();
      for (const e of expenses) {
        byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount);
      }
      const lines = Array.from(byCategory.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([cat, amt]) => `${cat}: ${this.currency(amt)}`);
      return `Here's your spending by category:\n${lines.join('\n')}`;
    }

    if (/recent|latest|last expense/.test(text)) {
      const recent = [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
      return `Your most recent expense(s):\n${recent
        .map((e) => `${e.date} — ${this.currency(e.amount)} (${e.category})`)
        .join('\n')}`;
    }

    if (category) {
      const filtered = expenses.filter((e) => e.category === category);
      const total = filtered.reduce((sum, e) => sum + e.amount, 0);
      return `You have ${filtered.length} expense(s) in ${category}, totaling ${this.currency(total)}.`;
    }

    return 'I can help with things like: "What\'s my total spending?", "What\'s my biggest expense?", "How much did I spend on Food?", or "Give me a breakdown by category." Try asking me one of those!';
  }

  private matchCategory(text: string): Expense['category'] | null {
    for (const c of EXPENSE_CATEGORIES) {
      if (text.includes(c.toLowerCase())) return c;
    }
    return null;
  }

  private currency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
