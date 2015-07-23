import Store from 'immutable-store';
import {Controller, Value} from 'cerebral';
import events from './events.js';

const initialState =  Store({
  nextRef: 0,
  todos: {},
  visibleTodos: function() {
    return {
      value: [],
      deps: {
        todos: ['todos']
      },
      get: function(refs, deps) {
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
});

let state = initialState;

export default Controller({
  onReset: function () {
    state = initialState;
    events.emit('change', state);
  },
  onSeek: function (seek, isPlaying, currentRecording) {
    state = state.import(currentRecording.initialState);
    events.emit('change', state);
  },
  onUpdate: function () {
    events.emit('change', state);
  },
  onGet: function (path) {
    return Value(path, state);
  },
  onSet: function (path, value) {
    const key = path.pop();
    state = Value(path, state).set(key, value);
  },
  onUnset: function (path, key) {
    console.log(arguments);
    state = Value(path, state).unset(key);
  },
  onPush: function (path, value) {
    state = Value(path, state).push(value);
  },
  onSplice: function () {
    let args = [].slice.call(arguments);
    const value = Value(args.shift(), state);
    state = value.splice.apply(value, args);
  },
  onMerge: function (path, value) {
    state = Value(path, state).merge(value);
  }
});
