let toggleAllChecked = function(cerebral, todo) {
    var isCompleted = !store.get('isAllChecked');
    cerebral.get('todos').forEach(function (todo) {
      cerebral.set([todo, 'completed'], isCompleted);
    });
    cerebral.set('isAllChecked', isCompleted);
};

export default toggleAllChecked;