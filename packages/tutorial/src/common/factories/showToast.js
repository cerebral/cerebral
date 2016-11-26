import {state, set, debounce} from 'cerebral/operators'

const toastDebounce = debounce.shared()
function showToast (message, ms, type = null) {
  if (ms) {
    return [
      set(state`app.toast`, {type}),
      set(state`app.toast.message`, message),
      toastDebounce(ms), {
        continue: [
          set(state`app.toast`, null)
        ],
        discard: []
      }
    ]
  }

  return [
    set(state`app.toast`, {type}),
    set(state`app.toast.message`, message)
  ]
}

export default showToast
