import * as tags from 'cerebral/tags'
import {
  IContext,
  IBranchContext,
  ChainSequenceFactory,
  ChainSequenceWithPropsFactory,
} from 'cerebral'
import * as App from './app/types'

type State = App.State

type Computed = App.Computed

type Signals = App.Signals

type Providers = App.Providers

export type Context<Props = {}> = IContext<Props> & Providers

export type BranchContext<Paths, Props = {}> = IBranchContext<Paths, Props> &
  Providers

export const sequence = ChainSequenceFactory<Context>()
export const sequenceWithProps = ChainSequenceWithPropsFactory<Context>()
export const state = tags.state as State
export const signals = tags.signals as Signals
export const computed = tags.computed as Computed
export const props = tags.props
