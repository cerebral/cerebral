import {
  listenTo,
  createRef
} from './helpers'

export default function createOnValue (controller) {
  return (path, signal, options = {}) => {
    let hasEmittedInitialValue = false
    listenTo(
      createRef(path, options),
      path,
      'value',
      signal,
      (data) => {
        if (!hasEmittedInitialValue) {
          hasEmittedInitialValue = true
          return
        }

        const payload = Object.assign({value: data.val()}, options.payload || {})

        controller.getSignal(signal)(payload)
      }
    )
  }
}
