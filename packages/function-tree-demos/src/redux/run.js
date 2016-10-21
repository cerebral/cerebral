import FunctionTree from 'function-tree'
import DebuggerProvider from 'function-tree/lib/providers/Debugger'
import ReduxProvider from 'function-tree/lib/providers/Redux'
import ContextProvider from 'function-tree/lib/providers/Context'
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
