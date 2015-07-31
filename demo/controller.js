import Controller from './CustomController.js';

const VisibleTodos = function() {
  return {
    value: [],
    deps: {
      todos: ['todos']
    },
    get: function(refs, deps) {
      return refs.map((ref) => deps.todos[ref]);
    }
  };
};

const state =  {
  nextRef: 0,
  url: '/',
  todos: {},
  visibleTodos: VisibleTodos,
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

export default Controller(state);
