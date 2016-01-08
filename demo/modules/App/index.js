import NewTodo from './modules/NewTodo';
import List from './modules/List';
import Footer from './modules/Footer';

export default (options = {}) => {
  return (module) => {

    module.registerModules({
      new: NewTodo(),
      list: List(),
      footer: Footer()
    });

  };
}
