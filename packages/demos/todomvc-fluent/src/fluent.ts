import {
  ConnectFactory,
  IContext,
  IBranchContext,
  SequenceFactory,
  SequenceWithPropsFactory,
} from '@cerebral/fluent'
import { Provider as RouterProvider } from '@cerebral/router'
import { IState, Signals } from './module/types'

interface IProviders {
  id: {
    create(): string
  }
  router: RouterProvider
  state: IState
  module: IState
}

export type Context<TProps = {}> = IContext<TProps> & IProviders
export type BranchContext<TPaths, TProps = {}> = IBranchContext<
  TPaths,
  TProps
> &
  IProviders

export const connect = ConnectFactory<IState, Signals>()
export const sequence = SequenceFactory<Context>()
export const sequenceWithProps = SequenceWithPropsFactory<Context>()
