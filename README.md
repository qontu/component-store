# Component Store

Inspired (semi-forked) of https://github.com/amcdnl/ngrx-actions

The mission of this (another more... :laughing:) `store` is to maintain the state of a component (not the wide app).

I have been searching for one and I didn't find any... then, I created it :sweet_smile:

## Dependencies

This module depends on [immer](https://github.com/mweststrate/immer)

## How to install?

`npm i immer @qontu/component-store` or `yarn add immer @qontu/component-store`

## How to use?

You can see an example [here](./playground/src/app/components/button)

## Why do I need to install immer?

Because it's a powerful inmutable state tree, it allow us to do:

```ts
@Store<UserListState>({
  users: User[],
})
export class UserListStore {

  @Action(Update)
  updateUsingImmer(state: UserListState, { user  }: Update) {
    state.users[user.id] = user;
  }

  @Action(Update)
  updateWithoutImmer(state: UserListState, { user  }: Update) {
    return {
      ...state,
      users: [
        ...state.users.filter(({ id }) => id !== user.id),
        user,
      ]
    }
  }
}
```

you can use both in the same time, choose the one that you prefer :smile:
