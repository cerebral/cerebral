import { Module } from 'cerebral'
import * as sequences from './sequences'
import { id } from './providers'
import { router, storage } from './modules'
import { State } from 'cerebral/proxy'

const state: State = {
  newTodoTitle: '',
  todos: {},
  filter: 'all',
  editingUid: null,
}

const signals = {
  rootRouted: sequences.redirectToAll,
  newTodoTitleChanged: sequences.changeNewTodoTitle,
  newTodoSubmitted: sequences.submitNewTodo,
  todoNewTitleChanged: sequences.changeTodoTitle,
  todoNewTitleSubmitted: sequences.submitTodoTitle,
  removeTodoClicked: sequences.removeTodo,
  todoDoubleClicked: sequences.editTodo,
  toggleAllChanged: sequences.toggleAllChecked,
  toggleTodoCompletedChanged: sequences.toggleTodoCompleted,
  todoNewTitleAborted: sequences.abortEdit,
  clearCompletedClicked: sequences.clearCompletedTodos,
  filterClicked: sequences.changeFilter,
}

export default Module<State, typeof signals>({
  state,
  signals,
  providers: {
    id,
  },
  modules: {
    router,
    storage,
  },
})
