import allTodosClicked from './signals/allTodosClicked';
import clearCompletedClicked from './signals/clearCompletedClicked';
import filterClicked from './signals/filterClicked';

export default (options = {}) => {
  return (module) => {

    module.state({
      filter: 'all'
    });

    module.signals({
      allTodosClicked,
      clearCompletedClicked,
      filterClicked
    });

  };
}
