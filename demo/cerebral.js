import Cerebral from './../src/Cerebral.js';

let state = localStorage.store ? JSON.parse(localStorage.store) : {
  todos: {},
  visibleTodos: () => {
    return {
      initialState: [],
      lookupState: ['todos'],
      get: (cerebral, sourceState, refs) => {
        return refs.map((ref) => sourceState.todos[ref]);
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
