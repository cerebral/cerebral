import {
  listenTo,
  createRef
} from './helpers'

export default function createOnChildChanged (controller) {
  return (path, signal, options = {}) => {
    listenTo(
      createRef(path, options),
      path,
      'child_changed',
      signal,
      (data) => {
        const initialPayload = {
          key: data.key,
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
