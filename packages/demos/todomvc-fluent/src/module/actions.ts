import { ActionContext, BranchWithNoDataContext } from '../globals';

export function redirectToAll ({ router }: ActionContext) {
  router.redirect('/all');
}

export function changeNewTodoTitle ({ state, props }: ActionContext<{ title: string }>) {
  state.newTodoTitle = props.title;
}

export function removeTodo ({ state, props }: ActionContext<{ uid: string }>) {
  state.todos.delete(props.uid);
}

export function toggleAllChecked ({ state }: ActionContext) {
  const isAllChecked = state.isAllChecked.get();
  state.visibleTodosUids.get().forEach(uid => {
    const todo = state.todos.get(uid);

    if (todo) {
      todo.completed = !isAllChecked;
    }
  });
}

export function toggleTodoCompleted ({ state, props }: ActionContext<{ uid: string }>) {
  const todo = state.todos.get(props.uid);
  if (todo) {
    todo.completed = !todo.completed;
  }
}

export function clearCompletedTodos({ state }: ActionContext) {
  state.todos.keys().forEach(uid => {
    const todo = state.todos.get(uid);

    if (todo && todo.completed) {
      state.todos.delete(uid);
    }
  });
}

export function changeFilter({ state, props }: ActionContext<{ filter: string }>) {
  state.filter = props.filter;
}

export function hasNewTodoTitle ({ state, path}: BranchWithNoDataContext<{ true: void, false: void }>): void {
  if (state.newTodoTitle) {
    return path.true();
  }

  return path.false();
}

export function addTodo ({ state, props, id }: ActionContext) {
  state.todos.set(id.create(), {
    title: state.newTodoTitle,
    completed: false,
    editedTitle: state.newTodoTitle
  });
}

export function clearTodoTitle ({ state }: ActionContext) {
  state.newTodoTitle = '';
}

export function changeTodoTitle ({ state, props }: ActionContext<{ uid: string, title: string }>) {
  const todo = state.todos.get(props.uid);
  if (todo) {
    todo.editedTitle = props.title;
  }
}

export function editTodo ({ state, props }: ActionContext<{ uid: string }>) {
  const todo = state.todos.get(props.uid);
  if (todo) {
    todo.editedTitle = todo.title;
    state.editingUid = props.uid;
  }
}

export function abortEditingTodo ({ state, props }: ActionContext<{ uid: string }>) {
  const todo = state.todos.get(props.uid);
  if (todo) {
    todo.editedTitle = '';
    state.editingUid = null;
  }
}

export function whenEditedTitle ({ state, props, path }: BranchWithNoDataContext<{ true: void, false: void }, { uid: string }>): void {
  const todo = state.todos.get(props.uid);
  if (todo && todo.editedTitle) {
    return path.true();
  }

  return path.false();
}

export function updateTodoTitle ({ state, props }: ActionContext<{ uid: string }>) {
  const todo = state.todos.get(props.uid);
  if (todo) {
    todo.title = todo.editedTitle;
    todo.editedTitle = '';
    state.editingUid = null;
  }
}