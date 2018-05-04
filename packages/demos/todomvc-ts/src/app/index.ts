import { Module } from 'cerebral'
import * as signals from './sequences'
import { id } from './providers'
import * as computed from './computed'
import { router, storage } from './modules'
import { State } from './types'

const state: State = {
  newTodoTitle: '',
  todos: {},
  filter: 'all',
  editingUid: null,
}

export default Module<State, typeof signals>({
  state,
  signals,
  providers: {
    id,
  },
  computed,
  modules: {
    router,
    storage,
  },
})
