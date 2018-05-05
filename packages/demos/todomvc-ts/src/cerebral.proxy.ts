import * as tags from 'cerebral/tags'
import {
  IContext,
  IBranchContext,
  ChainSequenceFactory,
  ChainSequenceWithPropsFactory,
} from 'cerebral'
import {
  State as AppState,
  Computed as AppComputed,
  Signals as AppSignals,
} from './app/types'

type State = AppState

type Computed = AppComputed

type Signals = AppSignals

interface Providers {
  id: {
    create(): string
  }
}

export type Context<TProps = {}> = IContext<TProps> & Providers
export type BranchContext<TPaths, TProps = {}> = IBranchContext<
  TPaths,
  TProps
> &
  Providers

export const sequence = ChainSequenceFactory<Context>()
export const sequenceWithProps = ChainSequenceWithPropsFactory<Context>()
export const state = tags.state as State
export const signal = tags.signal as Signals
export const props = tags.props
export const computed = tags.computed as Computed
