let toggleAllChecked = function(store, todo) {
    var isCompleted = !store.get('isAllChecked');
    store.get('todos').forEach(function (todo) {
      store.set([todo, 'completed'], isCompleted);
    });
    store.set('isAllChecked', isCompleted);
};

export default toggleAllChecked;