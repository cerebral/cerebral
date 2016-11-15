import firebaseListen from '../../../factories/firebaseListen'
// import firebaseGetValue from '../../../factories/firebaseGetValue'

export default [
  firebaseListen({
    moduleName: 'clients',
    firebasePath: 'clients',
    uidPath: 'user.currentUser.uid'
  })
  // firebaseGetValue('clients', 'user.currentUser.uid', 'clients.all')
]
