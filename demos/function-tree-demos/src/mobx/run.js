import FunctionTree from 'function-tree'
import {ContextProvider, DebuggerProvider} from 'function-tree/providers'
import axios from 'axios'
import store from './store'

export default FunctionTree([
  DebuggerProvider({
    colors: {
      axios: '#7ea732'
    }
  }),
  ContextProvider({
    axios,
    data: store.data,
    view: store.view
  })
])
