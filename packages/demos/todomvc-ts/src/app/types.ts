import * as signals from './sequences'
import * as computed from './computed'

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

export type Computed = { [key in keyof typeof computed]: typeof computed[key] }

export type Signals = { [key in keyof typeof signals]: typeof signals[key] }

export type Providers = {
  id: {
    create(): string
  }
}
