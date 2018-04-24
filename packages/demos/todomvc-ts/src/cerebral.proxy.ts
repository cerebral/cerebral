import * as tags from 'cerebral/tags'
import {
  IContext,
  IBranchContext,
  ChainSequenceFactory,
  ChainSequenceWithPropsFactory,
} from 'cerebral'

type State = {
  newTodoTitle: string
  todos: {
    [uid: string]: any
  }
  filter: string
  editingUid: string | null
}

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
export const state: State = tags.state
export const signal: any = tags.signal
export const props: any = tags.props
