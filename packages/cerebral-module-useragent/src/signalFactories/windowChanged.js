export default (path) => {
  return [
    function setMediaAndWindowSpec ({state, input}) {
      state.set(`${path.join('.')}.media`, input.media)
      state.set(`${path.join('.')}.window`, input.windowSpec)
    }
  ]
}
