import Router from '@cerebral/router'
import StorageProvider from '@cerebral/storage'
import { sequences } from 'cerebral.proxy'

export const router = Router({
  onlyHash: true,
  query: true,
  routes: [
    { path: '/', sequence: sequences.redirectToAll },
    { path: '/:filter', sequence: sequences.changeFilter },
  ],
})

export const storage = StorageProvider({
  target: window.localStorage,
  sync: { todos: 'todos' },
  prefix: 'todomvc',
})
