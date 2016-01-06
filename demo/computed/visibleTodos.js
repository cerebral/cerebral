export default function (get) {
  const todos = get(['todos']);
  const filter = get(['filter']);

  return Object.keys(todos).filter(function(key) {

    let todo = todos[key];
    return (
      filter === 'all' ||
      (filter === 'completed' && todo.completed) ||
      (filter === 'active' && !todo.completed)
    );

  }).map(function (key) {
    return todos[key];
  });
};
