import * as signals from './sequences'

export type State = {
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

export type Computed = {
  counts: {
    completed: number
    remaining: number
    total: number
    visible: number
  }
  isAllChecked: boolean
  visibleTodosUids: string[]
}

export type Signals = { [key in keyof typeof signals]: typeof signals[key] }
