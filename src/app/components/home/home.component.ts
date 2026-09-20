import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="d-flex flex-column align-items-center justify-content-center text-center hero mx-auto">
      <div class="display-1 mb-2">💰</div>
      <h1 class="display-4 fw-bold mb-3">Expense Tracker</h1>
      <p class="lead text-muted mb-4 col-md-8">
        Track your spending, spot trends, and stay on budget — all in one place.
      </p>
      <a routerLink="/add" class="btn btn-primary btn-lg px-4 shadow-sm">+ Add Expense</a>
    </div>
  `,
  styles: [
    `
      .hero {
        min-height: 65vh;
        max-width: 700px;
      }
    `
  ]
})
export class HomeComponent {}
