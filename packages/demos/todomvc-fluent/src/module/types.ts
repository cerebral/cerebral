import { Dictionary, ComputedValue } from '@cerebral/fluent';
import * as signals from './sequences';
import { Provider as RouterProvider } from '@cerebral/router';

export type Todo = {
  title: string,
  completed: boolean,
  editedTitle: string
};

export type ModuleState = {
  newTodoTitle: string,
  todos: Dictionary<Todo>,
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

type ModuleSignals = {
  [key in keyof typeof signals]: typeof signals[key]
};

export type Signals = ModuleSignals;

export type State = ModuleState;

export interface Providers {
  id: {
    create(): string
  };
  router: RouterProvider;
}



