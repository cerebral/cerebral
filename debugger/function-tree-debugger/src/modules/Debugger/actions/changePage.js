function changePage ({input, state}) {
  state.set('debugger.currentPage', input.page)
}

export default changePage
