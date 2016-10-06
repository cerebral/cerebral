export default (path) => {
  return [
    function setOfflineStatus ({state, input}) {
      state.set(`${path.join('.')}.network.offline`, input.offline)
    }
  ]
}
