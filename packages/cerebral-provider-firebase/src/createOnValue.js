import {
  listenTo,
  createRef
} from './helpers'

export default function createOnValue (controller) {
  return (path, signal, options) => {
    listenTo(
      createRef(path, options),
      path,
      'value',
      signal,
      (data) => {
        controller.getSignal(signal)({
          value: data.val()
        })
      }
    )
  }
}
