import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Expense } from '../models/expense.model';

const API_URL = 'http://localhost:3000/expenses';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  expenses = signal<Expense[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  fetchExpenses(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<Expense[]>(API_URL).subscribe({
      next: (data) => {
        // json-server sometimes returns ids/amounts as strings — normalize them.
        this.expenses.set(
          data.map((e) => ({ ...e, id: Number(e.id), amount: Number(e.amount) }))
        );
        this.loading.set(false);
      },
      error: () => {
        this.error.set(
          'Failed to load expenses. Is json-server running on http://localhost:3000?'
        );
        this.loading.set(false);
      }
    });
  }

  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${API_URL}/${id}`);
  }

  addExpense(expense: Omit<Expense, 'id'>): Observable<Expense> {
    return this.http
      .post<Expense>(API_URL, expense)
      .pipe(tap(() => this.fetchExpenses()));
  }

  updateExpense(id: number, expense: Omit<Expense, 'id'>): Observable<Expense> {
    return this.http
      .put<Expense>(`${API_URL}/${id}`, expense)
      .pipe(tap(() => this.fetchExpenses()));
  }

  deleteExpense(id: number): Observable<unknown> {
    return this.http
      .delete(`${API_URL}/${id}`)
      .pipe(tap(() => this.fetchExpenses()));
  }
}
