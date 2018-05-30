import ls from 'local-storage'
import page from 'page'
import * as reactions from './reactions'
import * as sequences from './sequences'
import * as computed from './computed'
import * as providers from './providers'

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
    },
    reactions,
    sequences,
    computed,
    providers,
  }
}
