import { FunctionTree, Provider, } from 'function-tree';
import { IContext, sequenceFactory } from 'function-tree/fluent'
import { Devtools } from 'function-tree/devtools'

const devtools = new Devtools({
  host: ''
})

type FooProvider = {
  get(test: string): string
}

const provider: FooProvider = {
  get() {
    return 'foo'
  }
}

const FooProvider = new Provider(provider)

const ft = new FunctionTree({
  foo: FooProvider
})

devtools.watchExecution(ft)

interface AppContext<Props = {}> extends IContext<Props> {
  foo: FooProvider
}

const sequence = sequenceFactory<AppContext, { foo: string}>(s => s
  .action(function ({ props, foo }) {
    
  })
)
ft.run(sequence, {
  bar: 'string'
})
