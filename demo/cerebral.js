import Cerebral from './../src/Cerebral.js';

var state = localStorage.store ? JSON.parse(localStorage.store) : {
  todos: {},
  visibleTodos: function() {
    return {
      value: [],
      deps: ['todos'],
      get: function(cerebral, deps, refs) {
        return refs.map(function(ref) {
          return deps.todos[ref];
        });
      }
    };
  },
  newTodoTitle: '',
  isSaving: false,
  isAllChecked: false,
  editedTodo: null,
  showCompleted: true,
  showNotCompleted: true,
  remainingCount: 0,
  completedCount: 0,
  filter: 'all'
};

export default Cerebral(state);
