import firebaseListen from '../../../factories/firebaseListen'
import firebaseGetValue from '../../../factories/firebaseGetValue'

export default [
  firebaseListen({
    moduleName: 'clients',
    firebasePath: 'clients',
    uidPath: 'user.currentUser.uid'
  }),
  firebaseGetValue({
    firebasePath: 'clients',
    uidPath: 'user.currentUser.uid',
    localCollectionPath: 'clients.all'
  }), {
    success: [],
    error: []
  }
]
