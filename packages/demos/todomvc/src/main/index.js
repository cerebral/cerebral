import ls from 'local-storage'
import page from 'page'
import * as reactions from './reactions'
import * as sequences from './sequences'
import * as providers from './providers'
import { counts, uids, isAllChecked } from './computed'

export default ({ app }) => {
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
    state: {
      newTodoTitle: '',
      todos: ls.get('todos') || {},
      filter: 'all',
      editingUid: null,
      counts,
      uids,
      isAllChecked,
    },
    reactions,
    sequences,
    providers,
  }
}
