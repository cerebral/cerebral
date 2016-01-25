import clearCompletedClicked from './signals/clearCompletedClicked';
import filterClicked from './signals/filterClicked';

export default (options = {}) => {
  return (module) => {

    module.state({
      filter: 'all'
    });

    module.signals({
      clearCompletedClicked,
      filterClicked
    });

  };
}
