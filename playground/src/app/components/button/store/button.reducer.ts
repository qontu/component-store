import { Store, Action } from '../../../../../../src/actions';

import { ButtonState } from './button.state';
import { Click } from './button.actions';

@Store<ButtonState>({
  isClicked: false,
})
export class ButtonStore {
  @Action(Click)
  click(state: ButtonState, { isClicked }: Click): ButtonState {
    return {
      ...state,
      isClicked,
    };
  }
}
