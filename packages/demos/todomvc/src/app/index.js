import { Module } from 'cerebral'
import * as sequences from './sequences'
import * as providers from './providers'
import * as modules from './modules'
import * as computed from './computed'

export default Module({
  state: {
    newTodoTitle: '',
    todos: {},
    filter: 'all',
    editingUid: null,
  },
  sequences,
  providers,
  computed,
  modules,
})
