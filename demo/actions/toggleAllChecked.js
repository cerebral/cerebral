function toggleAllChecked (args, state) {

    let isCompleted = !state.get('isAllChecked');
    let todos = state.get('todos');

    Object.keys(todos).forEach(function (key) {
      let todo = todos[key];
      state.set(['todos', todo.$ref, 'completed'], isCompleted);
    });

    state.set('isAllChecked', isCompleted);
};

export default toggleAllChecked;
