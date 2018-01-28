import { ObservableMap, SignalWithPayload, Signal, ComputedValue } from '@cerebral/fluent';

type Todo = {
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

export type Signals = {
  rootRouted: SignalWithPayload<{ filter: string }>,
  newTodoTitleChanged: SignalWithPayload<{ title: string }>,
  newTodoSubmitted: Signal,
  todoNewTitleChanged: SignalWithPayload<{ uid: string, title: string }>,
  todoNewTitleSubmitted: SignalWithPayload<{ uid: string }>,
  removeTodoClicked: SignalWithPayload<{ uid: string }>,
  todoDoubleClicked: SignalWithPayload<{ uid: string }>,
  toggleAllChanged: Signal,
  toggleTodoCompletedChanged: SignalWithPayload<{ uid: string }>,
  todoNewTitleAborted: SignalWithPayload<{ uid: string }>,
  clearCompletedClicked: Signal,
  filterClicked: SignalWithPayload<{ filter: string }>
};