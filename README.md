# Expense Tracker (Angular)

A multi-page Expense Tracker built with Angular standalone components, Signals,
Reactive Forms, and a small local REST API (json-server). Includes a custom
pipe, a custom attribute directive, and a student-built chatbot that answers
natural-language questions about your expenses.

## Features

- **Home** (`/`) — landing page with a call-to-action.
- **Add Expense** (`/add`) and **Edit Expense** (`/edit/:id`) — one reusable
  `ExpenseFormComponent` (Reactive Forms: required amount > 0, required
  category, required date that can't be in the future, optional note ≤ 200
  chars).
- **Expense List** (`/expenses`) — table of expenses with filter by category,
  search by note, sort by date/amount (asc/desc), a running total (of the
  currently visible/filtered expenses), Edit/Delete actions, and an
  empty-state message.
- **Custom pipe** — `categoryIcon` prefixes a category with an emoji
  (e.g. "🍔 Food").
- **Custom directive** — `appHighlightOverBudget` highlights any row whose
  amount exceeds a threshold (default 100).
- **Chatbot** — a floating widget (bottom-right, on every page) that answers
  questions like "What's my total spending?", "What's my biggest expense?",
  "How much did I spend on Food?", or "Give me a breakdown by category." It
  reads live data from `ExpenseService` and needs no external API key.

## Project structure

```
db.json                          → json-server data file
src/app/
  app.routes.ts                  → '/', '/add', '/expenses', '/edit/:id'
  models/expense.model.ts
  services/
    expense.service.ts           → GET/POST/PUT/DELETE + getExpenseById + expenses signal
    ai-chatbot.service.ts        → rule-based NL responder over expense data
  pipes/category-icon.pipe.ts
  directives/highlight-over-budget.directive.ts
  components/
    navbar/                      → persistent nav (routerLink + routerLinkActive)
    home/
    expense-form/                → Reactive Form, handles both /add and /edit/:id
    expense-list/                → table, filters, sorting, total, Edit/Delete
    chatbot/                     → floating chat widget
```

## Setup & Running

You need two things running at once: the **json-server API** and the
**Angular dev server**.

### 1. Install dependencies

```bash
npm install
```

### 2. Start the API (terminal #1)

`db.json` already contains a few sample expenses. json-server is included as
a dev dependency, so you can run it via the npm script:

```bash
npm run api
```

This serves the API at `http://localhost:3000/expenses` and supports
`GET`, `POST`, `PUT`/`PATCH`, and `DELETE`.

(If you'd rather install it globally: `npm install -g json-server`, then
`json-server --watch db.json --port 3000`.)

### 3. Start the Angular app (terminal #2)

```bash
ng serve
```

This runs `ng serve`. Open `http://localhost:4200` in your browser.

> Keep both terminals running while you work — the Angular app depends on
> the API being reachable at `http://localhost:3000`.

## Notes

- Some json-server versions return `id` as a string; `ExpenseService`
  normalizes `id` and `amount` to numbers after every fetch.
- Styling uses Bootstrap 5 (imported in `src/styles.css`).