import * as sequences from './sequences'
import * as computed from './computed'
import * as providers from './providers'
import * as modules from './modules'
import { State } from './types'

const state: State = {
  newTodoTitle: '',
  todos: {},
  filter: 'all',
  editingUid: null,
}

export default {
  state,
  sequences,
  computed,
  providers,
  modules,
}
