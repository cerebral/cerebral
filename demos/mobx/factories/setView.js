function setViewFactory(prop, value) {
  function setView({view}) {
    view.set(prop, value);
  }

  return setView;
}

export default setViewFactory;
