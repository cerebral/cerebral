export default function unToggleSettings ({state, input}) {
  const unToggleFieldsWhenChecked = state.get(`${input.field}.unToggleFieldsWhenChecked`)
  if (unToggleFieldsWhenChecked) {
    unToggleFieldsWhenChecked.forEach((unToggle) => {
      state.set(`${unToggle}.value`, false)
    })
  }
}
