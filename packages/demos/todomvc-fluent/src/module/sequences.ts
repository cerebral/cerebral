import { Sequence, SequenceWithProps } from '../globals';
import * as actions from './actions';

export const redirectToAll = SequenceWithProps<{ filter: string }>(s => s
  .action(actions.redirectToAll)
);

export const changeNewTodoTitle = SequenceWithProps<{ title: string }>(s => s
  .action(actions.changeNewTodoTitle)
);

export const removeTodo = SequenceWithProps<{ uid: string}>(s => s
  .action(actions.removeTodo)
);

export const toggleAllChecked = Sequence(s => s
  .action(actions.toggleAllChecked)
);

export const toggleTodoCompleted = SequenceWithProps<{ uid: string}>(s => s
  .action(actions.toggleTodoCompleted)
);

export const clearCompletedTodos = Sequence(s => s
  .action(actions.clearCompletedTodos)
);

export const changeFilter = SequenceWithProps<{ filter: string }>(s => s
  .action(actions.changeFilter)
);

export const submitNewTodo = Sequence(s => s
  .pathsAction(actions.hasNewTodoTitle)
  .paths({ 
    true: s => s.action(actions.addTodo, actions.clearTodoTitle),
    false: s => s
  })
);

export const changeTodoTitle = SequenceWithProps<{ uid: string, title: string }>(s => s
  .action(actions.changeTodoTitle)
);

export const editTodo = SequenceWithProps<{ uid: string }>(s => s
  .action(actions.editTodo)
);

export const abortEdit = SequenceWithProps<{ uid: string}>(s => s
  .action(actions.abortEditingTodo)
);

export const submitTodoTitle = SequenceWithProps<{ uid: string }>(s => s
  .pathsAction(actions.whenEditedTitle)
  .paths({
    true: s => s.action(actions.updateTodoTitle),
    false: s => s
  })
);
