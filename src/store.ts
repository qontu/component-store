import { Observable, BehaviorSubject } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { ensureStoreMetadata, StoreMetadata } from "./decorators/internals";

const INITIAL_STATE = "___INITIALIZE_STATE___";

export class Store<S, Actions = any> {
  private store: BehaviorSubject<S>;
  private store$: Observable<S>;
  private reducers: StoreMetadata<S, Actions>;

  constructor(storeReducer: Actions, private options: { debug: boolean } = { debug: false }) {
    this.reducers = ensureStoreMetadata(storeReducer);
    this.store = new BehaviorSubject<S>({} as any);
    this.store$ = this.store.asObservable().pipe(distinctUntilChanged());
    this.dispatch({ type: INITIAL_STATE, payload: this.reducers.initialState });
  }

  observe(): Observable<S> {
    return this.store$;
  }

  getState(): S {
    return this.store.getValue();
  }

  dispatch(action: { type: string; payload?: any }): void {
    if (this.options.debug) {
      console.log(
        `ACTION DISPATCHED: ${action.type}`,
        `::Current state:`,
        this.store.getValue(),
        `::Next state:`,
        this.currentReducer(this.store.getValue(), action),
      );
    }

    this.store.next(this.currentReducer(this.store.getValue(), action));
  }

  select<T>(select: (store: S) => T): Observable<T> {
    return this.store$.pipe(
      map(select),
      distinctUntilChanged(),
    );
  }

  currentReducer(state: S, action: Action) {
    if (action.type === INITIAL_STATE) {
      return this.reducers.initialState;
    }

    const meta = this.reducers.actions[action.type];
    const reducer = this.reducers.inst;

    if (meta) {
      return reducer[meta.fn](this.store.getValue(), action);
    }

    return this.store.getValue();
  }
}

// export function createStore<T, S>(reducers: { [key: string]: Reducer }) {
//   return new Store<T, S>(reducers);
// }

export type Reducer = (state: any, action: Action) => any;
export interface Action {
  type: string;
  payload?: any;
}
