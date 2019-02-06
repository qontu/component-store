import { ensureStoreMetadata } from './internals';

export function Store<TState>(initialState?: TState): ClassDecorator;
export function Store(initialState?: any): ClassDecorator;
export function Store(initialState: any = {}): ClassDecorator {
  return target => {
    const meta = ensureStoreMetadata(target);
    meta.initialState = initialState;
  };
}
