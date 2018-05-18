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

type Sequences = App.Sequences

type Providers = App.Providers

export type Context<Props = {}> = IContext<Props> & Providers

export type BranchContext<Paths, Props = {}> = IBranchContext<Paths, Props> &
  Providers

export const Sequence = ChainSequenceFactory<Context>()
export const SequenceWithProps = ChainSequenceWithPropsFactory<Context>()
export const state = tags.state as State
export const sequences = tags.sequences as Sequences
export const computed = tags.computed as Computed
export const props = tags.props
