import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand navbar-dark bg-dark px-3 shadow-sm">
      <a class="navbar-brand fw-semibold" routerLink="/">💰 Expense Tracker</a>
      <div class="navbar-nav flex-row gap-3">
        <a
          class="nav-link"
          routerLink="/"
          routerLinkActive="active-link"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          Home
        </a>
        <a class="nav-link" routerLink="/add" routerLinkActive="active-link">Add Expense</a>
        <a class="nav-link" routerLink="/expenses" routerLinkActive="active-link">View Expenses</a>
      </div>
    </nav>
  `,
  styles: [
    `
      .active-link {
        font-weight: 700;
        text-decoration: underline;
        text-underline-offset: 4px;
      }
    `
  ]
})
export class NavbarComponent {}
