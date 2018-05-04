import Router from '@cerebral/router'
import StorageProvider from '@cerebral/storage'

export const router = Router({
  onlyHash: true,
  query: true,
  routes: [
    { path: '/', signal: 'redirectToAll' },
    { path: '/:filter', signal: 'changeFilter' },
  ],
})

export const storage = StorageProvider({
  target: window.localStorage,
  sync: { todos: 'todos' },
  prefix: 'todomvc',
})
