import { ActionType, ensureStoreMetadata } from './internals';

export function Action(...actionsClasses: ActionType[]) {
  return (target: any, name: string, descriptor: TypedPropertyDescriptor<any>) => {
    const meta = ensureStoreMetadata(target.constructor);

    for (const klass of actionsClasses) {
      const { type } = new klass();

      if (meta.actions[type]) {
        throw new Error(
          `@Action for '${type}' is defined multiple times in functions '${meta.actions[type].fn}' and '${name}'`,
        );
      }

      meta.actions[type] = {
        action: klass,
        fn: name,
        type,
      };
    }
  };
}
