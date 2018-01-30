import { Module, ObservableMap, Computed } from '@cerebral/fluent';
import * as sequences from './sequences';
import * as providers from './providers';
import { counts, isAllChecked, visibleTodosUids } from './computed';
import { State, Signals } from './types';

export default Module<State, Signals>({
  state: {
    newTodoTitle: '',
    todos: ObservableMap({}),
    filter: 'all',
    editingUid: null,
    visibleTodosUids: Computed(visibleTodosUids),
    counts: Computed(counts),
    isAllChecked: Computed(isAllChecked)
  },
  signals: {
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
  },
  providers
});
