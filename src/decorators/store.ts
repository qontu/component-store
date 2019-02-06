import { ensureStoreMetadata } from './internals';

export function Store<TState>(initialState?: TState): (target: () => any) => void;
export function Store(initialState?: any): (target: () => any) => void;
export function Store(initialState: any = {}) {
  return (target: () => any) => {
    const meta = ensureStoreMetadata(target);
    meta.initialState = initialState;
  };
}
