import { ConnectFactory, IContext, IContextWithPaths, IContextWithNoDataPaths, SequenceFactory, SequenceWithPropsFactory } from '@cerebral/fluent';
import { State } from './module/state';
import { Signals } from './module/';
import { Provider as RouterProvider } from '@cerebral/router';

type Providers = {
  id: {
    create(): string
  },
  router: RouterProvider
};

export interface SignalContext<Props = {}> extends IContext<Props>, Providers {
  state: State;
}

export interface ActionContext<Props = {}> extends SignalContext<Props> {}

export interface ActionContextWithPaths<Props, Paths> extends IContextWithPaths<Props, Paths>, Providers {
  state: State;
}

export interface ActionContextWithNoDataPaths<Props, Paths> extends IContextWithNoDataPaths<Props, Paths>, Providers {
  state: State;
}

export function connect<TProps>() {
  return ConnectFactory<TProps, State, Signals>();
}

export const Sequence = (<TOutput = {}>() => SequenceFactory<SignalContext, TOutput>())();
export const SequenceWithProps = (<TProps, TOutput = TProps>() => SequenceWithPropsFactory<SignalContext, TProps, TOutput>())();
