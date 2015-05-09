import Cerebral from './../src/Cerebral.js';

var state = localStorage.store ? JSON.parse(localStorage.store) : {
  todos: [],
  visibleTodos: [],
  newTodoTitle: '',
  isSaving: false,
  isAllChecked: false,
  editedTodo: null,
  showCompleted: true,
  showNotCompleted: true,
  remainingCount: 0,
  completedCount: 0,
  activeRoute: ''
};

export default Cerebral(state);
