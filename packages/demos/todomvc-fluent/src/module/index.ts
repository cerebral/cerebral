import { Module, ObservableMap } from '@cerebral/fluent';
import * as sequences from './sequences';
import * as providers from './providers';
import { counts, isAllChecked, visibleTodosUids} from './getters';
import { State, Signals } from './types';

export default Module<State, Signals>({
  state: {
    newTodoTitle: '',
    todos: ObservableMap({}),
    filter: 'all',
    editingUid: null,
    get visibleTodosUids (): string[] { return visibleTodosUids(this) },
    counts,
    isAllChecked
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
