import {set, state} from 'cerebral/operators'

export default {
  signals: {
    routed: [
      set(state`app.currentView`, 'Checkout')
    ]
  }
}
