import { ConnectFactory } from '@cerebral/fluent';
import { State, Signals } from './root';

export type Context = {
  state: State
};

export function connect<TProps>() {
  return ConnectFactory<TProps, State, Signals>();
}
