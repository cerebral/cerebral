export default function hidePanel ({state, props}) {
  const neverHidePanel = state.get(`${props.field}.neverHidePanel`)
  if (!neverHidePanel) {
    state.set('app.settings.showErrors', false)
  }
}
