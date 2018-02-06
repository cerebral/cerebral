import { Module, Computed, Dictionary } from '@cerebral/fluent';
import Router from '@cerebral/router';
import * as signals from './sequences';
import * as providers from './providers';
import { State, Todo, Signals } from './types';
import { counts, isAllChecked, visibleTodosUids } from './computed';

const nameof = <T>(name: keyof T) => name;

const router = Router({
  onlyHash: true,
  query: true,
  routes: [
    { path: '/', signal: nameof<Signals>('redirectToAll') },
    { path: '/:filter', signal: nameof<Signals>('changeFilter') }
  ]
});

const state: State = {
  newTodoTitle: '',
  todos: Dictionary<Todo>({}),
  filter: 'all',
  editingUid: null,
  visibleTodosUids: Computed(visibleTodosUids),
  counts: Computed(counts),
  isAllChecked: Computed(isAllChecked)
};

export default Module({
  state,
  signals,
  modules: {
    router
  },
  providers
});
