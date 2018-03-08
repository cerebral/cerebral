import { ConnectFactory, IContext, IBranchContext, SequenceFactory, SequenceWithPropsFactory } from '@cerebral/fluent';
import { Provider as RouterProvider } from '@cerebral/router';
import { State, Signals } from './module/types';
import { HttpProvider } from '@cerebral/http';

interface Providers {
  id: {
    create(): string;
  };
  router: RouterProvider;
  http: HttpProvider;
  state: State;
  module: State;
}

export type Context<TProps = {}> = IContext<TProps> & Providers;
export type BranchContext<TPaths, TProps = {}> = IBranchContext<TPaths, TProps> & Providers;

export const connect = ConnectFactory<State, Signals>();
export const sequence = SequenceFactory<Context>();
export const sequenceWithProps = SequenceWithPropsFactory<Context>();
