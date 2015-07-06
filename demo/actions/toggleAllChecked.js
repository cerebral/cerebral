let toggleAllChecked = (cerebral) => {

    let isCompleted = !cerebral.get('isAllChecked');
    let todos = cerebral.get('todos');

    Object.keys(todos).forEach((key) => {
      let todo = todos[key];
      cerebral.set([todo, 'completed'], isCompleted);
    });
    
    cerebral.set('isAllChecked', isCompleted);
};

export default toggleAllChecked;
