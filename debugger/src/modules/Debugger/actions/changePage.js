function changePage ({props, state}) {
  state.set('debugger.currentPage', props.page)
}

export default changePage
