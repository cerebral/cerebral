import * as sequences from './sequences'

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
  counts: {
    completed: number
    remaining: number
    total: number
    visible: number
  }
  uids: string[]
  isAllChecked: boolean
}

export type Sequences = {
  [key in keyof typeof sequences]: typeof sequences[key]
}

export type Providers = {
  id: {
    create(): string
  }
}
