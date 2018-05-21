import uuid from 'uuid'
import { Provider } from 'cerebral'

export const id = Provider({
  create() {
    return uuid.v4()
  },
})
