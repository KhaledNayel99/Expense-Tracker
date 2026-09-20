import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { EXPENSE_CATEGORIES, Expense } from '../../models/expense.model';


function noFutureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const value = new Date(control.value);
  return value.getTime() > today.getTime() ? { futureDate: true } : null;
}

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-7">
        <div class="card shadow-sm">
          <div class="card-body">
            <h2 class="card-title mb-4">{{ isEditMode() ? 'Update Expense' : 'Add Expense' }}</h2>

            @if (loadError()) {
              <div class="alert alert-danger">{{ loadError() }}</div>
            }

            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Amount</label>
                <input type="number" step="0.01" class="form-control" formControlName="amount" />
                @if (form.controls.amount.invalid && form.controls.amount.touched) {
                  <div class="text-danger small mt-1">
                    @if (form.controls.amount.errors?.['required']) {
                      Amount is required.
                    }
                    @if (form.controls.amount.errors?.['min']) {
                      Amount must be greater than 0.
                    }
                  </div>
                }
              </div>

              <div class="mb-3">
                <label class="form-label">Category</label>
                <select class="form-select" formControlName="category">
                  <option value="" disabled>Select a category</option>
                  @for (cat of categories; track cat) {
                    <option [value]="cat">{{ cat }}</option>
                  }
                </select>
                @if (form.controls.category.invalid && form.controls.category.touched) {
                  <div class="text-danger small mt-1">Category is required.</div>
                }
              </div>

              <div class="mb-3">
                <label class="form-label">Date</label>
                <input type="date" class="form-control" formControlName="date" />
                @if (form.controls.date.invalid && form.controls.date.touched) {
                  <div class="text-danger small mt-1">
                    @if (form.controls.date.errors?.['required']) {
                      Date is required.
                    }
                    @if (form.controls.date.errors?.['futureDate']) {
                      Date cannot be in the future.
                    }
                  </div>
                }
              </div>

              <div class="mb-3">
                <label class="form-label">Note (optional)</label>
                <textarea class="form-control" rows="3" maxlength="200" formControlName="note"></textarea>
                @if (form.controls.note.invalid && form.controls.note.touched) {
                  <div class="text-danger small mt-1">Note cannot exceed 200 characters.</div>
                }
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary" [disabled]="form.invalid || submitting()">
                  {{ isEditMode() ? 'Update Expense' : 'Add Expense' }}
                </button>
                <a routerLink="/expenses" class="btn btn-outline-secondary">Cancel</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExpenseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private expenseService = inject(ExpenseService);

  categories = EXPENSE_CATEGORIES;
  editingId = signal<number | null>(null);
  submitting = signal(false);
  loadError = signal<string | null>(null);

  isEditMode = () => this.editingId() !== null;

  form = this.fb.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    date: ['', [Validators.required, noFutureDateValidator]],
    note: ['', Validators.maxLength(200)]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.editingId.set(id);
      this.expenseService.getExpenseById(id).subscribe({
        next: (expense) =>
          this.form.patchValue({
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            note: expense.note ?? ''
          }),
        error: () => this.loadError.set('Could not load that expense.')
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);

    const raw = this.form.getRawValue();
    const payload = {
      amount: Number(raw.amount),
      category: raw.category as Expense['category'],
      date: raw.date,
      note: raw.note || undefined
    };
    
    const id = this.editingId();
    const request$ =
      id !== null ? this.expenseService.updateExpense(id, payload) : this.expenseService.addExpense(payload);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/expenses']);
      },
      error: () => {
        this.submitting.set(false);
        this.loadError.set('Something went wrong saving this expense.');
      }
    });
  }
}
