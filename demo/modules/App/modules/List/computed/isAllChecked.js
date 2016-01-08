import visibleTodos from './visibleTodos';

export default function (get) {
  let todos = get(visibleTodos);

  return todos.filter(function(todo) {
    return !todo.completed;
  }).length === 0 && todos.length !== 0;
};
