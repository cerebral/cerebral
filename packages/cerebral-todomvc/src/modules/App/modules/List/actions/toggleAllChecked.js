function toggleAllChecked ({state, module}) {

    let isCompleted = !module.state.get(['isAllChecked']);
    let todos = module.state.get(['todos']);

    Object.keys(todos).forEach(function (key) {
      let todo = todos[key];
      module.state.set(['todos', todo.$ref, 'completed'], isCompleted);
    });

    module.state.set(['isAllChecked'], isCompleted);
};

export default toggleAllChecked;
