import { Sequence } from '@cerebral/fluent';
import { Context } from '../globals';
import * as actions from './actions';

export const redirectToAll = Sequence<Context, { filter: string }>(s => s
  .action(actions.redirectToAll)
);

export const changeNewTodoTitle = Sequence<Context, { title: string }>(s => s
  .action(actions.changeNewTodoTitle)
);

export const removeTodo = Sequence<Context, { uid: string}>(s => s
  .action(actions.removeTodo)
);

export const toggleAllChecked = Sequence<Context, void>(s => s
  .action(actions.toggleAllChecked)
);

export const toggleTodoCompleted = Sequence<Context, { uid: string}>(s => s
  .action(actions.toggleTodoCompleted)
);

export const clearCompletedTodos = Sequence<Context, void>(s => s
  .action(actions.clearCompletedTodos)
);

export const changeFilter = Sequence<Context, { filter: string }>(s => s
  .action(actions.changeFilter)
);

export const submitNewTodo = Sequence<Context, void>(s => s
  .pathsAction(actions.hasNewTodoTitle)
  .paths({ 
    true: s => s.action(actions.addTodo, actions.clearTodoTitle),
    false: s => s
  })
);

export const changeTodoTitle = Sequence<Context, { uid: string, title: string }>(s => s
  .action(actions.changeTodoTitle)
);

export const editTodo = Sequence<Context, { uid: string }>(s => s
  .action(actions.editTodo)
);

export const abortEdit = Sequence<Context, { uid: string}>(s => s
  .action(actions.abortEditingTodo)
);

export const submitTodoTitle = Sequence<Context, { uid: string }>(s => s
  .pathsAction(actions.whenEditedTitle)
  .paths({
    true: s => s.action(actions.updateTodoTitle),
    false: s => s
  })
);
