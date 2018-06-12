// @ts-ignore
import ls from 'local-storage'
import { ModuleDefinition } from 'cerebral'
import page from 'page'
import * as reactions from './reactions'
import * as sequences from './sequences'
import * as providers from './providers'
import { counts, uids, isAllChecked } from './computed'
import { State } from './types'

const state: State = {
  newTodoTitle: '',
  todos: ls.get('todos') || {},
  filter: 'all',
  editingUid: null,
  counts,
  uids,
  isAllChecked,
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
    providers,
  }
}

export default module
