import { createDraft, finishDraft, isDraft } from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ensureStoreMetadata, StoreMetadata } from './decorators/internals';

const INITIAL_STATE = '___INITIALIZE_STATE___';

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
    const draft = createDraft(this.store.getValue());
    const maybeNewState = this.currentReducer(draft as S, action);
    const newState = isDraft(maybeNewState) || maybeNewState == null ? finishDraft(draft) : maybeNewState;

    if (this.options.debug) {
      console.log(
        `ACTION DISPATCHED: ${action.type}`,
        `::Current state:`,
        this.store.getValue(),
        `::Next state:`,
        newState,
      );
    }

    this.store.next(newState as S);
  }

  select<T>(select: (store: S) => T): Observable<T> {
    return this.store$.pipe(
      map(select),
      distinctUntilChanged(),
      // shareReplay(1), // TODO(toni): implement it
    );
  }

  private currentReducer(state: S, action: Action) {
    if (action.type === INITIAL_STATE) {
      return this.reducers.initialState;
    }

    const meta = this.reducers.actions[action.type];
    const reducer = this.reducers.inst;

    if (meta) {
      return reducer[meta.fn](state, action);
    }

    return state;
  }
}

// export function createStore<T, S>(reducers: { [key: string]: Reducer }) {
//   return new Store<T, S>(reducers);
// }

export type Reducer<S> = (state: S, action: Action) => S;
interface Action {
  type: string;
  payload?: any;
}

type Klass = new (...args: any[]) => any;

interface Provider<S> {
  provide: typeof Store;
  useFactory?: (reducer: Klass) => Store<S>;
  useValue?: Klass;
  deps?: Klass[];
}

export function forComponent<S = any>(reducer: Klass): Provider<S>[] {
  return [
    { provide: reducer, useValue: reducer },
    {
      provide: Store,
      useFactory: newStore,
      deps: [reducer],
    },
  ];
}

export function newStore<S>(reducer: Klass): Store<S> {
  return new Store(reducer);
}
