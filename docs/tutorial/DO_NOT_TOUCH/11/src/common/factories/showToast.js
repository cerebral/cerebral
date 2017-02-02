import {set, merge, debounce} from 'cerebral/operators'
import {state} from 'cerebral/tags'

const toastDebounce = debounce.shared()
function showToast (message, ms, type = null) {
  if (!ms) {
    return [
      merge(state`app.toast`, {type, message})
    ]
  }

  if (ms) {
    return [
      merge(state`app.toast`, {type, message}),
      toastDebounce(ms), {
        continue: [
          set(state`app.toast`, null)
        ],
        discard: []
      }
    ]
  }
}

export default showToast
