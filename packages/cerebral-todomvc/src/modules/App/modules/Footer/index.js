import clearCompletedClicked from './signals/clearCompletedClicked';
import filterClicked from './signals/filterClicked';

export default (options = {}) => {
  return (module) => {

    module.addState({
      filter: 'all'
    });

    module.addSignals({
      clearCompletedClicked,
      filterClicked
    });

  };
}
