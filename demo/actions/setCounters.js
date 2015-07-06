let setCounters = (cerebral, value) => {

  let todos = cerebral.get('todos');
  let counts = Object.keys(todos).reduce((counts, key) => {

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

  cerebral.merge({
    remainingCount: counts.remainingCount,
    completedCount: counts.completedCount
  });

  return value;

};

export default setCounters;
