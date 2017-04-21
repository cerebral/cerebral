import {Controller, provide} from 'cerebral'
import Devtools from 'cerebral/devtools'
import uuid from 'uuid'
import Router from 'cerebral-router'
import {redirect} from 'cerebral-router/operators'
import StorageProvider from 'cerebral-provider-storage'
import {set, toggle, unset, when} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'
import addTodo from './actions/addTodo'
import toggleAllChecked from './actions/toggleAllChecked'
import clearCompletedTodos from './actions/clearCompletedTodos'

import GraphQlModule from './GraphQl'

const users = [
  {
    id: 1,
    username: 'christianalfoni',
    email: 'christianalfoni@gmail.com'
  }
]

const posts = [
  {
    id: 1,
    title: 'test',
    body: 'woop'
  }
]

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
    provide('uuid', uuid),
    StorageProvider({
      target: window.localStorage,
      sync: {todos: 'todos'},
      prefix: 'todomvc'
    })
  ],
  modules: {
    graphql: GraphQlModule({
      schema: `
        type Post {
          id: Int!
          title: String
          body: String
        }

        type User {
          id: Int!
          username: String
          email: String
        }

        type Query {
          posts: [Post]
          post (id: Int!): Post
          users: [User]
          user: User
        }

        schema {
          query: Query
        }
      `,
      root: {
        post({ id }) {
          return posts.filter((post) => post.id === id)[0]
        },
        posts(...args) {
          console.log(args);
          return posts
        },
        user({ id }) {
          return users.filter((user) => user.id === id)[0]
        },
        users() {
          return users
        }
      }
    })
  },
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
      set(state`filter`, props`filter`)
    ]
  }
})

export default controller
