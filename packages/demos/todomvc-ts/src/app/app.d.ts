/* eslint-disable */
declare module 'cerebral/proxy' {
  type AppState = {
    newTodoTitle: string
    todos: {
      [uid: string]: any
    }
    filter: string
    editingUid: string | null
  }
}
