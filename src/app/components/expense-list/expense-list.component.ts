import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { CategoryIconPipe } from '../../pipes/category-icon.pipe';
import { HighlightOverBudgetDirective } from '../../directives/highlight-over-budget.directive';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '../../models/expense.model';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, CategoryIconPipe, HighlightOverBudgetDirective],
  template: `
    <h2 class="mb-4">Your Expenses</h2>

    @if (expenseService.error()) {
      <div class="alert alert-danger">{{ expenseService.error() }}</div>
    }

    <div class="row g-3 mb-3 align-items-end">
      <div class="col-md-3">
        <label class="form-label">Category</label>
        <select class="form-select" [ngModel]="category()" (ngModelChange)="category.set($event)">
          <option value="All">All</option>
          @for (cat of categories; track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label">Search note</label>
        <input
          class="form-control"
          placeholder="Search by note..."
          [ngModel]="search()"
          (ngModelChange)="search.set($event)"
        />
      </div>
      <div class="col-md-3">
        <label class="form-label">Sort by</label>
        <select class="form-select" [ngModel]="sortBy()" (ngModelChange)="sortBy.set($event)">
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>
      </div>
      <div class="col-md-2">
        <label class="form-label">Direction</label>
        <select class="form-select" [ngModel]="sortDir()" (ngModelChange)="sortDir.set($event)">
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>

    <div class="card bg-light mb-3">
      <div class="card-body d-flex justify-content-between align-items-center">
        <span class="fw-semibold">Total visible ({{ filteredExpenses().length }} expense(s)):</span>
        <span class="fs-4 fw-bold text-primary">{{ total() | currency }}</span>
      </div>
    </div>

    @if (expenseService.loading()) {
      <p class="text-muted">Loading expenses...</p>
    } @else if (filteredExpenses().length === 0) {
      <div class="alert alert-info">No expenses match your filters yet.</div>
    } @else {
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (expense of filteredExpenses(); track expense.id) {
              <tr [appHighlightOverBudget]="expense.amount" [threshold]="threshold()">
                <td>{{ expense.category | categoryIcon }}</td>
                <td>{{ expense.amount | currency }}</td>
                <td>{{ expense.date }}</td>
                <td>{{ expense.note || '—' }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-2" (click)="edit(expense.id)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" (click)="remove(expense.id)">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `
})
export class ExpenseListComponent implements OnInit {
  expenseService = inject(ExpenseService);
  private router = inject(Router);

  categories = EXPENSE_CATEGORIES;
  threshold = signal(100);

  category = signal<'All' | ExpenseCategory>('All');
  search = signal('');
  sortBy = signal<'date' | 'amount'>('date');
  sortDir = signal<'asc' | 'desc'>('desc');

  filteredExpenses = computed(() => {
    let list = this.expenseService.expenses();

    if (this.category() !== 'All') {
      list = list.filter((e) => e.category === this.category());
    }

    const term = this.search().trim().toLowerCase();
    if (term) {
      list = list.filter((e) => (e.note ?? '').toLowerCase().includes(term));
    }

    const dir = this.sortDir() === 'asc' ? 1 : -1;
    const key = this.sortBy();
    list = [...list].sort((a, b) => {
      if (key === 'amount') return (a.amount - b.amount) * dir;
      return a.date.localeCompare(b.date) * dir;
    });

    return list;
  });

  total = computed(() => this.filteredExpenses().reduce((sum, e) => sum + e.amount, 0));

  ngOnInit(): void {
    this.expenseService.fetchExpenses();
  }

  edit(id: number): void {
    this.router.navigate(['/edit', id]);
  }

  remove(id: number): void {
    if (confirm('Delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe();
    }
  }
}
