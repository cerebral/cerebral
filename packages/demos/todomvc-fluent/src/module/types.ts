import { Dictionary, ComputedValue } from '@cerebral/fluent';
import * as signals from './sequences';

export type Todo = {
  title: string;
  completed: boolean;
  editedTitle: string;
};

export type State = {
  newTodoTitle: string;
  todos: Dictionary<Todo>;
  filter: string;
  editingUid: string | null;
  counts: ComputedValue<{
    completed: number;
    remaining: number;
    total: number;
    visible: number;
  }>;
  visibleTodosUids: ComputedValue<string[]>;
  isAllChecked: ComputedValue<boolean>;
};

export type Signals = {[key in keyof typeof signals]: typeof signals[key]};
