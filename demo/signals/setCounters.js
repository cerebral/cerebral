let setCounters = function(store) {

  let counts = store.get('todos').reduce(function(counts, todo) {
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

  store.merge({
    remainingCount: counts.remainingCount,
    completedCount: counts.completedCount
  });

};

export default setCounters;
