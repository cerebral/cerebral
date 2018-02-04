import { ConnectFactory, IContext, IBranchContext, SequenceFactory, SequenceWithPropsFactory } from '@cerebral/fluent';
import { State, Signals, Providers } from './module/types';

export interface Context<Props = {}> extends IContext<Props>, Providers {
  state: State;
}

export interface BranchContext<Paths, Props = {}> extends IBranchContext<Paths, Props>, Providers {
  state: State;
}

export const connect = ConnectFactory<State, Signals>();

export const sequence = SequenceFactory<Context>();

export const sequenceWithProps = SequenceWithPropsFactory<Context>();
