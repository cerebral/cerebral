import { listenTo, createRef } from './helpers'

export default function onChildChanged(path, signal, options = {}) {
  listenTo(createRef(path, options), path, 'child_changed', signal, (data) => {
    this.context.controller.getSignal(signal)(
      Object.assign(
        {
          key: data.key,
          value: data.val(),
        },
        options.payload || {}
      )
    )
  })
}
