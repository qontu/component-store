import { Reducer } from "../store";

export const STORE_ACTIONS_META = Symbol("@qontu/store");

export interface ActionType {
  new (...args: any[]): any;
}
export interface StoreMetadata<S, Actions> {
  initialState?: S;
  actions: ActionsMeta;
  // effects: ActionsMeta;
  inst: Record<string, Reducer>;
}

export interface ActionMeta {
  action: ActionType;
  fn: string;
  type: string;
}

export type ActionsMeta = Record<string, ActionMeta>;

export function ensureStoreMetadata<T>(target: T): StoreMetadata<any, any> {
  // see https://github.com/angular/angular/blob/master/packages/core/src/util/decorators.ts#L60
  if (!target.hasOwnProperty(STORE_ACTIONS_META)) {
    const defaultMetadata: StoreMetadata<any, any> = { inst: new (target as any)(), actions: {} /* , effects: {} */ };
    Object.defineProperty(target, STORE_ACTIONS_META, { value: defaultMetadata });
  }
  return target[STORE_ACTIONS_META];
}
