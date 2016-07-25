function setFilter ({input, state}) {
  state.set('app.filter', input.filter || 'all')
}

export default setFilter
