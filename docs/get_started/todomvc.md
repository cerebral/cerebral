# Example: TodoMVC

This example only shows a commented version of the controller. Please go to [TodoMVC repo](https://github.com/cerebral/cerebral/tree/master/demos/todomvc) to see complete source code.

```js
import {Controller} from 'cerebral'
import Devtools from 'cerebral/devtools'
import {ContextProvider} from 'cerebral/providers'
import uuid from 'uuid'
import Router, {redirect} from '@cerebral/router'
// Providers
import StorageProvider from '@cerebral/storage'
// Operators
import {set, toggle, unset, when} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'
// Actions
import addTodo from './actions/addTodo'
import toggleAllChecked from './actions/toggleAllChecked'
import clearCompletedTodos from './actions/clearCompletedTodos'

const controller = Controller({
  devtools: Devtools({ remoteDebugger: 'localhost:8787' }),
  // The router maps urls to signal execution
  router: Router({
    onlyHash: true,
    routes: {
      '/': 'rootRouted',
      '/:filter': 'filterClicked'
    }
  }),
  // Providing side effects to the signal execution. ContextProvider
  // is a simple way to inject any library
  providers: [
    StorageProvider({
      sync: {todos: 'todos'},
      prefix: 'todomvc'
    }),
    ContextProvider({uuid})
  ],
  // Initial state
  state: {
    newTodoTitle: '',
    todos: window.localStorage.getItem('todomvc.todos') ? JSON.parse(window.localStorage.getItem('todomvc.todos')) : {},
    filter: 'all',
    editingUid: null
  },
  // Most of the logic of TodoMVC can be expressed with operators
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
    filterClicked: set(state`filter`, props`filter`)
  }
})

export default controller
```
