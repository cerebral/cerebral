function copyInputToViewFactory(inputProp, viewProp) {
  function copyInputToView({input, view}) {
    view.set(viewProp, input[inputProp]);
  }

  return copyInputToView;
}

export default copyInputToViewFactory;
