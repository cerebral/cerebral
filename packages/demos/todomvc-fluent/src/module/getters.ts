import { State } from './types';

export function counts (this: State) {
  return this.visibleTodosUids.get().reduce(
    (counts, uid) => {
      const todo = this.todos.get(uid);

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
      total: this.todos.values().length,
      visible: this.visibleTodosUids.get().length,
    }
  );
}
export function  visibleTodosUids (this: State): string[] {
  return this.todos.keys().filter(uid => {
    const todo = this.todos.get(uid);

    return (
      this.filter === 'all' ||
      (this.filter === 'completed' && todo && todo.completed) ||
      (this.filter === 'active' && todo && !todo.completed)
    );
  });
}
export function  isAllChecked (this: State) {
  return (
    this.visibleTodosUids.get().filter(uid => {
      const todo = this.todos.get(uid);

      return todo && !todo.completed;
    }).length === 0 && this.visibleTodosUids.get().length !== 0
  );
}
