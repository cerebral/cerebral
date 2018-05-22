import { ModuleDefinition } from 'cerebral'
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

const module: ModuleDefinition = {
  state,
  sequences,
  computed,
  providers,
  modules,
}

export default module
