let setCounters = function(cerebral, value) {

  let counts = cerebral.get('todos').reduce(function(counts, todo) {
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

  cerebral.merge({
    remainingCount: counts.remainingCount,
    completedCount: counts.completedCount
  });

  return value;

};

export default setCounters;
