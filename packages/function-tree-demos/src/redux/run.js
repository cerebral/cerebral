import FunctionTree from 'function-tree'
import {ContextProvider, DebuggerProvider, ReduxProvider} from 'function-tree/providers'
import axios from 'axios'
import store from './store'

export default FunctionTree([
  DebuggerProvider({
    colors: {
      axios: '#7ea732'
    }
  }),
  ReduxProvider(store),
  ContextProvider({
    axios
  })
])
