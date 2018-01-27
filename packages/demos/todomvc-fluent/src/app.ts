import { Module, Sequence } from '@cerebral/fluent';

export type State = {
  foo: string
};

export type Signals = {
  test: (props: {}) => void
};

export type Context = {
  state: State
};

export type Connector<Props = {}> = {
  state: State,
  props: Props
};

const testSequence = Sequence<Context, {}>(s => s
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