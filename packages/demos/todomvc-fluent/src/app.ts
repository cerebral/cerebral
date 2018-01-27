import { Module, Sequence, FluentConnectFactory } from '@cerebral/fluent';

export type State = {
  foo: string
};

export type Signals = {
  test: (props?: void) => void
};

export type Context = {
  state: State
};

const testSequence = Sequence<Context, void>(s => s
  .action(function test ({ state }) {
    state.foo = 'bar2';
  })
);

export default Module<State, Signals>({
  state: {
    foo: 'bar'
  },
  signals: {
    test: testSequence
  }
});

export function connect<TProps>() {
  return FluentConnectFactory<TProps, State, Signals>();
}