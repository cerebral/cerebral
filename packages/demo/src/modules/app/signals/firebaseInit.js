import firebaseListen from '../../../factories/firebaseListen'
import firebaseGetValue from '../../../factories/firebaseGetValue'
import {set, merge, state, input} from 'cerebral/operators'

export default [
  // start listening
  firebaseListen({
    moduleName: 'clients',
    firebasePath: 'clients',
    uidPath: 'user.$currentUser.uid'
  }),
  firebaseListen({
    moduleName: 'projects',
    firebasePath: 'projects',
    uidPath: 'user.$currentUser.uid'
  }),

  // get data first time
  firebaseGetValue({
    firebasePath: 'clients',
    uidPath: 'user.$currentUser.uid'
  }), {
    success: [
      set(state`clients.all`, {
        'no-client': {
          ref: 'no-client',
          name: 'No client',
          $isDefaultItem: true
        }
      }),
      merge(state`clients.all`, input`value`)
    ],
    error: [
      set(state`clients.$error`, input`error`)
    ]
  },
  firebaseGetValue({
    firebasePath: 'projects',
    uidPath: 'user.$currentUser.uid'
  }), {
    success: [
      set(state`projects.all`, {
        'no-project': {
          ref: 'no-project',
          name: 'no project',
          clientRef: 'no-client',
          $isDefaultItem: true
        }
      }),
      merge(state`projects.all`, input`value`)
    ],
    error: [
      set(state`projects.$error`, input`error`)
    ]
  }
]
