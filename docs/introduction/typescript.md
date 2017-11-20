# TypeScript

When writing applications with Cerebral and TypeScript, the simplest and most comfortable solution
is to create a single file exporting the state, signals and context types. By using an alias in
tsconfig, you can import this file anywhere without having to worry about relative paths.

For this documentation, let's say you export these types from an 'app.ts' file, imported with 'app'.

## Actions

When writing actions, you can precisely type the arguments. In order for your action context to
include your providers' types, you can wrap `ActionContext` inside your `app.ts` file:

```ts
// ====== app.ts
import { ActionContext as BaseActionContext } from 'cerebral'

interface Providers {
  foo: FooProviderType
  // etc
}

export type ActionContext<C = { props: any }> = BaseActionContext < C & Providers >
```

Now in your actions file, you can import your context definition and use it to type the function's
arguments:

```ts
// ====== myAction.ts
import { ActionContext } from 'app'

export function myAction ( { props, foo, state }: ActionContext ) {

}
```

If you want to be even more precise and include the props passed to the action, you can do this:

```ts
// ====== myAction.ts
import { ActionContext } from 'app'

interface Props {
  name: string
  id: string
  age: number
  // ...
}

export function myAction ( { props, foo, state }: ActionContext < Props > ) {
  const { name, id, age } = props // all are typed here
}
```