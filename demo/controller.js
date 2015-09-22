import Controller from './../src/index.js';
import Model from 'cerebral-baobab';

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
  recorder: {
    isRecording: false,
    isPlaying: false,
    hasRecorded: false
  },
  nextRef: 0,
  url: '/',
  todos: {},
  visibleTodosIds: [],
  visibleTodos: Model.monkey({
    cursors: {
      todos: ['todos'],
      ids: ['visibleTodosIds']
    },
    get: function (data) {
      return data.ids.map(function (id) {
        return data.todos[id];
      });
    }
  }),
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

const model = Model(state);

export default Controller(model);
