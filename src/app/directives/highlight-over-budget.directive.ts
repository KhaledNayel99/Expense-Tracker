import { Directive, ElementRef, Input, OnChanges, inject } from '@angular/core';

/**
 * Custom attribute directive: [appHighlightOverBudget]
 *
 * Usage:
 *   <tr [appHighlightOverBudget]="expense.amount" [threshold]="100">
 *
 * If the bound amount exceeds the threshold (default 100), the host element
 * gets a light red/orange background to visually flag it as an over-budget
 * expense. Otherwise the background is left unchanged.
 */
@Directive({
  selector: '[appHighlightOverBudget]',
  standalone: true
})
export class HighlightOverBudgetDirective implements OnChanges {
  @Input('appHighlightOverBudget') amount = 0;
  @Input() threshold = 100;

  private el = inject(ElementRef<HTMLElement>);

  ngOnChanges(): void {
    this.el.nativeElement.style.backgroundColor =
      this.amount > this.threshold ? '#ffe0cc' : '';
  }
}
