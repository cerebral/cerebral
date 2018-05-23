// @ts-ignore
import ls from 'local-storage'
import { ModuleDefinition } from 'cerebral'
import page from 'page'
import * as reactions from './reactions'
import * as sequences from './sequences'
import * as computed from './computed'
import * as providers from './providers'
import { State } from './types'

const state: State = {
  newTodoTitle: '',
  todos: ls.get('todos') || {},
  filter: 'all',
  editingUid: null,
}

const module: ModuleDefinition = ({ app }) => {
  app.on('initialized', () =>
    page.start({
      hashbang: true,
    })
  )

  page.redirect('/', '/all')
  page('/:filter', ({ path, params }) =>
    app.runSequence(path, sequences.changeFilter, params)
  )

  return {
    reactions,
    state,
    sequences,
    computed,
    providers,
  }
}

export default module
