export default function unToggleSettings ({state, props}) {
  const unToggleFieldsWhenChecked = state.get(`${props.field}.unToggleFieldsWhenChecked`)
  if (unToggleFieldsWhenChecked) {
    unToggleFieldsWhenChecked.forEach((unToggle) => {
      state.set(`${unToggle}.value`, false)
    })
  }
}
