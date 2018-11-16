import { ensureStoreMetadata, ActionType } from "./internals";

export function Action(actionsClass: any) {
  return function(target: any, name: string, descriptor: TypedPropertyDescriptor<any>) {
    const meta = ensureStoreMetadata(target.constructor);

      const { type } = new actionsClass();

      if (meta.actions[type]) {
        throw new Error(
          `@Action for '${type}' is defined multiple times in functions '${meta.actions[type].fn}' and '${name}'`,
        );
      }

      meta.actions[type] = {
        action: actionsClass,
        fn: name,
        type,
      };
    }
}
