export default function hidePanel ({state, input}) {
  const neverHidePanel = state.get(`${input.field}.neverHidePanel`)
  if (!neverHidePanel) {
    state.set('app.settings.showErrors', false)
  }
}
