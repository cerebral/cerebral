function copyInputToViewFactory (inputProp, viewProp) {
  function copyInputToView ({input, view}) {
    view[viewProp] = input[inputProp]
  }

  return copyInputToView
}

export default copyInputToViewFactory
