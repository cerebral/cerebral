function changeToModelPage ({state}) {
  if (state.get('useragent.window.width') < 1270) {
    state.set('debugger.currentPage', 'model')
  }
}

export default changeToModelPage
