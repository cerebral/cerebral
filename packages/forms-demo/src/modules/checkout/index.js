import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default {
  signals: {
    routed: [
      set(state`app.currentView`, 'Checkout')
    ]
  }
}
