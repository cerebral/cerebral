import { ConnectFactory, IContext, IBranchContext, SequenceFactory, SequenceWithPropsFactory } from '@cerebral/fluent';
import { Provider as RouterProvider } from '@cerebral/router';
import { State, Signals } from './module/types';
import { HttpModule } from '@cerebral/http';

interface Providers {
  id: {
    create(): string;
  };
  router: RouterProvider;
  http: HttpModule;
}

export interface Context<Props = {}> extends IContext<Props>, Providers {
  state: State;
}

export interface BranchContext<Paths, Props = {}> extends IBranchContext<Paths, Props>, Providers {
  state: State;
}

export const connect = ConnectFactory<State, Signals>();

export const sequence = SequenceFactory<Context>();

export const sequenceWithProps = SequenceWithPropsFactory<Context>();
