import { Directive, ElementRef, Input, OnChanges, inject } from '@angular/core';


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
