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
    [uid: string]: {
      title: string
      completed: boolean
      editedTitle: string
    }
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
export const state = tags.state as State
export const signal = tags.signal
export const props = tags.props
export const path = {} as State
