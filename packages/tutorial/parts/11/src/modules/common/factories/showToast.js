import {state, set, debounce} from 'cerebral/operators'

const toastDebounce = debounce.shared()
function showToast (message, ms, type = null) {
  return [
    set(state`app.toast`, {type}),
    set(state`app.toast.message`, message),
    ...toastDebounce(ms, [
      set(state`app.toast`, null)
    ])
  ]
}

export default showToast
