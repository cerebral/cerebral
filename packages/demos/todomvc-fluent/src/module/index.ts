import { Module } from '@cerebral/fluent';
import { initialState, State } from './state';
import * as sequences from './sequences';
import * as providers from './providers';

export type Signals = {
  [key in keyof typeof sequences]: typeof sequences[key]
};

export default Module<State, Signals>({
  state: initialState,
  signals: sequences,
  providers
});
