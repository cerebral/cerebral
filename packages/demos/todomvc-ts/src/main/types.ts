import * as sequences from './sequences'
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

export type Sequences = {
  [key in keyof typeof sequences]: typeof sequences[key]
}

export type Providers = {
  id: {
    create(): string
  }
}
