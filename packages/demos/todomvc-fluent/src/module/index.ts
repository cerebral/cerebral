import { Module, Computed, Dictionary, pathFor } from '@cerebral/fluent'
import Router from '@cerebral/router'
import * as signals from './sequences'
import * as providers from './providers'
import { State, Todo, Signals } from './types'
import { counts, isAllChecked, visibleTodosUids } from './computed'

const router = Router({
  onlyHash: true,
  query: true,
  routes: [
    { path: '/', signal: pathFor<Signals>(x => x.redirectToAll) },
    { path: '/:filter', signal: pathFor<Signals>(x => x.changeFilter) },
  ],
})

const state: State = {
  newTodoTitle: '',
  todos: Dictionary<Todo>({}),
  filter: 'all',
  editingUid: null,
  visibleTodosUids: Computed(visibleTodosUids),
  counts: Computed(counts),
  isAllChecked: Computed(isAllChecked),
}

export default Module({
  state,
  signals,
  modules: {
    router,
  },
  providers,
})
