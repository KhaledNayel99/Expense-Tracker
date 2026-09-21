import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-md navbar-dark bg-dark px-3 shadow-sm">
      <a class="navbar-brand fw-semibold" routerLink="/">💰 Expense Tracker</a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav flex-column flex-md-row gap-md-3 mt-2 mt-md-0">
          
            class="nav-link"
            routerLink="/"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="exactMatchOptions"
          >
            Home
          <a class="nav-link" routerLink="/app-home" routerLinkActive="active-link">Home</a>
          <a class="nav-link" routerLink="/add" routerLinkActive="active-link">Add Expense</a>
          <a class="nav-link" routerLink="/expenses" routerLinkActive="active-link">View Expenses</a>
        </div>
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
export class NavbarComponent {
  exactMatchOptions = { exact: true };
}