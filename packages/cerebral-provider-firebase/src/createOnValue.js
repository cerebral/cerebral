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

        const initialPayload = {
          value: data.val()
        }
        let payload = initialPayload

        if (options.payload) {
          payload = Object.keys(options.payload).reduce((payload, key) => {
            payload[key] = options.payload[key]

            return payload
          }, initialPayload)
        }
        controller.getSignal(signal)(payload)
      }
    )
  }
}
