function setFilter ({input, state}) {
  state.set('app.footer.filter', input.filter || 'all')
}

export default setFilter
