import { Dictionary, ComputedValue } from '@cerebral/fluent'
import * as signals from './sequences'

export interface ITodo {
  title: string
  completed: boolean
  editedTitle: string
}

export interface IState {
  newTodoTitle: string
  todos: Dictionary<ITodo>
  filter: string
  editingUid: string | null
  counts: ComputedValue<{
    completed: number
    remaining: number
    total: number
    visible: number
  }>
  visibleTodosUids: ComputedValue<string[]>
  isAllChecked: ComputedValue<boolean>
}

export type Signals = { [key in keyof typeof signals]: typeof signals[key] }
