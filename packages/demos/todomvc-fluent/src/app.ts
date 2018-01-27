import { Module } from '@cerebral/fluent';

export type State = {
  foo: string
};

export type Context = {
  state: State
}

export type Connector<Props = {}> = {
  state: State,
  props: Props
}

export default Module<State, {}>({
  state: {
    foo: 'bar'
  }
});