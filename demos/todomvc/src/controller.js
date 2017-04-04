import {Controller} from 'cerebral'
import Devtools from 'cerebral/devtools'
import {ContextProvider} from 'cerebral/providers'
import uuid from 'uuid'
import Router, {redirect} from 'cerebral-router'
import StorageProvider from 'cerebral-provider-storage'
import {set, toggle, unset, when} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'
import addTodo from './actions/addTodo'
import toggleAllChecked from './actions/toggleAllChecked'
import clearCompletedTodos from './actions/clearCompletedTodos'

const controller = Controller({
  devtools: Devtools({ remoteDebugger: 'localhost:8787' }),
  router: Router({
    onlyHash: true,
    routes: {
      '/': 'rootRouted',
      '/:filter': 'filterClicked'
    }
  }),
  providers: [
    StorageProvider({
      target: window.localStorage,
      sync: {todos: 'todos'},
      prefix: 'todomvc'
    }),
    ContextProvider({uuid})
  ],
  state: {
    newTodoTitle: '',
    todos: window.localStorage.getItem('todomvc.todos') ? JSON.parse(window.localStorage.getItem('todomvc.todos')) : {},
    filter: 'all',
    editingUid: null
  },
  signals: {
    rootRouted: redirect('/all'),
    newTodoTitleChanged: set(state`newTodoTitle`, props`title`),
    newTodoSubmitted: [
      when(state`newTodoTitle`), {
        true: [
          addTodo,
          set(state`newTodoTitle`, '')
        ],
        false: []
      }
    ],
    todoNewTitleChanged: set(state`todos.${props`uid`}.editedTitle`, props`title`),
    todoNewTitleSubmitted: [
      when(state`todos.${props`uid`}.editedTitle`), {
        true: [
          set(state`todos.${props`uid`}.title`, state`todos.${props`uid`}.editedTitle`),
          unset(state`todos.${props`uid`}.editedTitle`),
          set(state`editingUid`, null)
        ],
        false: []
      }
    ],
    removeTodoClicked: [
      unset(state`todos.${props`uid`}`)
    ],
    todoDoubleClicked: [
      set(state`todos.${props`uid`}.editedTitle`, state`todos.${props`uid`}.title`),
      set(state`editingUid`, props`uid`)
    ],
    toggleAllChanged: [
      toggleAllChecked
    ],
    toggleTodoCompletedChanged: [
      toggle(state`todos.${props`uid`}.completed`)
    ],
    todoNewTitleAborted: [
      unset(state`todos.${props`uid`}.editedTitle`),
      set(state`editingUid`, null)
    ],
    clearCompletedClicked: [
      clearCompletedTodos
    ],
    filterClicked: [
      set(state`filter`, props`filter`),
      function Test () {
        throw new Error('Wuuut?')
      }
    ]
  }
})

export default controller
