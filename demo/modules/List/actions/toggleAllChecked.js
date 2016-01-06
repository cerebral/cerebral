function toggleAllChecked ({state, module}) {

    let isCompleted = !state.get([module, 'isAllChecked']);
    let todos = state.get([module, 'todos']);

    Object.keys(todos).forEach(function (key) {
      let todo = todos[key];
      state.set([module, 'todos', todo.$ref, 'completed'], isCompleted);
    });

    state.set([module, 'isAllChecked'], isCompleted);
};

export default toggleAllChecked;
