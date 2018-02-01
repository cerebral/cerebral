import { State } from './state';

export function counts (state: State) {
  return state.visibleTodosUids.get().reduce(
    (counts, uid) => {
      const todo = state.todos.get(uid);

      if (todo && todo.completed) {
        counts.completed++;
      } else {
        counts.remaining++;
      }

      counts.total++;

      return counts;
    },
    {
      completed: 0,
      remaining: 0,
      total: state.todos.values().length,
      visible: state.visibleTodosUids.get().length,
    }
  );
}
export function  visibleTodosUids (state: State): string[] {
  return state.todos.keys().filter(uid => {
    const todo = state.todos.get(uid);

    return (
      state.filter === 'all' ||
      (state.filter === 'completed' && todo && todo.completed) ||
      (state.filter === 'active' && todo && !todo.completed)
    );
  });
}
export function  isAllChecked (state: State) {
  return (
    state.visibleTodosUids.get().filter(uid => {
      const todo = state.todos.get(uid);

      return todo && !todo.completed;
    }).length === 0 && state.visibleTodosUids.get().length !== 0
  );
}
