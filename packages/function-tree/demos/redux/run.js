import FunctionTree from 'function-tree/src'
import DebuggerProvider from 'function-tree/providers/Debugger'
import ReduxProvider from 'function-tree/providers/Redux'
import ContextProvider from 'function-tree/providers/Context'
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
