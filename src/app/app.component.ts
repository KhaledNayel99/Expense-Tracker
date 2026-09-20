import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { ExpenseService } from './services/expense.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ChatbotComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="container py-4">
      <router-outlet></router-outlet>
    </main>
    <app-chatbot></app-chatbot>
  `
})
export class AppComponent implements OnInit {
  private expenseService = inject(ExpenseService);

  ngOnInit(): void {

    this.expenseService.fetchExpenses();
  }
}
