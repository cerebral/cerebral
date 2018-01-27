import { Module } from '@cerebral/fluent';
import * as sequences from './sequences';

export type State = {
  foo: string
};

export type Signals = {
  test: (props?: void) => void
};

export default Module<State, Signals>({
  state: {
    foo: 'bar'
  },
  signals: {
    test: sequences.testSequence
  }
});
