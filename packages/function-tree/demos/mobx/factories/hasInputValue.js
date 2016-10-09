function hasInputValueFactory(prop) {
  function hasInputValue({input, path}) {
    if (Boolean(input[prop])) {
      return path.true();
    }

    return path.false();
  }

  return hasInputValue;
}

export default hasInputValueFactory;
