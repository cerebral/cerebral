export default function (get) {
  let todos = get(['app', 'list', 'todos']);
  let counts = Object.keys(todos).reduce(function(counts, key) {

    let todo = todos[key];

    if (todo.completed) {
      counts.completedCount++;
    } else if (!todo.completed) {
      counts.remainingCount++;
    }

    return counts;

  }, {
    completedCount: 0,
    remainingCount: 0
  });

  return {
    remainingCount: counts.remainingCount,
    completedCount: counts.completedCount
  };

}
