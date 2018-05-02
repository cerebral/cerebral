import * as tags from 'cerebral/tags'
import {
  IContext,
  IBranchContext,
  ChainSequenceFactory,
  ChainSequenceWithPropsFactory,
} from 'cerebral'
import { State as AppState, Computed as AppComputed } from './app/types'

type State = AppState

type Computed = AppComputed

interface Providers {
  id: {
    create(): string
  }
  computed: {
    get<T>(path: T): T
  }
  state: {
    get<T>(path: T): T
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
export const signal = tags.signal
export const props = tags.props
export const computed = tags.computed as Computed
export const computedPath = tags.computedPath as Computed
export const statePath = tags.statePath as State
