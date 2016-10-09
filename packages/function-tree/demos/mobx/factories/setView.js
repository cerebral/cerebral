function setViewFactory(prop, value) {
  function setView({view}) {
    view[prop] = value;
  }

  return setView;
}

export default setViewFactory;
