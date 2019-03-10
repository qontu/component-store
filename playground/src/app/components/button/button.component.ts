import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, forComponent } from '../../../../../src';
import * as fromStore from './store';

@Component({
  selector: 'app-button',
  template: `
    <button (click)="onClick()">Click me!</button>
    <p>Button is clicked? {{ isClicked$ | async }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [forComponent(fromStore.ButtonStore)],
})
export class ButtonComponent {
  isClicked$ = this.store$.select(({ isClicked }) => isClicked);
  constructor(private store$: Store<fromStore.ButtonState>) {}

  onClick() {
    this.store$.dispatch(new fromStore.Click(true));
  }
}
