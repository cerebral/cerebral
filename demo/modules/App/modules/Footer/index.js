import allTodosClicked from './signals/allTodosClicked';
import clearCompletedClicked from './signals/clearCompletedClicked';
import filterClicked from './signals/filterClicked';

export default (options = {}) => {
  return (module) => {

    module.state({
      filter: 'all',
      remainingCount: 0,
      completedCount: 0
    });

    module.signal('allTodosClicked', allTodosClicked);
    module.signalSync('clearCompletedClicked', clearCompletedClicked);
    module.signalSync('filterClicked', filterClicked);

  };
}
