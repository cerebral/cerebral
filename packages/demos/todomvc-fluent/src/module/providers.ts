import * as uuid from 'uuid'
import { Provider } from '@cerebral/fluent'

export const id = Provider({
  create() {
    return uuid.v4()
  },
})
