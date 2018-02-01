import { ObservableMap, ComputedValue, Computed } from '@cerebral/fluent';
import { counts, isAllChecked, visibleTodosUids } from './computed';

export type Todo = {
  title: string,
  completed: boolean,
  editedTitle: string
};

export type State = {
  newTodoTitle: string,
  todos: ObservableMap<Todo>,
  filter: string,
  editingUid: string | null,
  counts: ComputedValue<{
    completed: number,
    remaining: number,
    total: number,
    visible: number
  }>,
  visibleTodosUids: ComputedValue<string[]>,
  isAllChecked: ComputedValue<boolean>
};

export const initialState: State = {
  newTodoTitle: '',
  todos: ObservableMap<Todo>({}),
  filter: 'all',
  editingUid: null,
  visibleTodosUids: Computed(visibleTodosUids),
  counts: Computed(counts),
  isAllChecked: Computed(isAllChecked)
};