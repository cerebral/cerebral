import NewTodo from './modules/NewTodo';
import List from './modules/List';
import Footer from './modules/Footer';

export default (options = {}) => {
  return (module) => {

    module.modules({
      new: NewTodo(),
      list: List(),
      footer: Footer()
    });

  };
}
