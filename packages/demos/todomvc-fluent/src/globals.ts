import { ConnectFactory, IContext, IContextWithPaths, IContextWithNoDataPaths } from '@cerebral/fluent';
import { State, Signals } from './module/types';
import { Provider as RouterProvider } from '@cerebral/router';

type Providers = {
  id: {
    create(): string
  },
  router: RouterProvider
};

export interface Context<Props = {}> extends IContext<Props>, Providers {
  state: State;
}

export interface ContextWithPaths<Props, Paths> extends IContextWithPaths<Props, Paths>, Providers {
  state: State;
}

export interface ContextWithNoDataPaths<Props, Paths> extends IContextWithNoDataPaths<Props, Paths>, Providers {
  state: State;
}

export function connect<TProps>() {
  return ConnectFactory<TProps, State, Signals>();
}
