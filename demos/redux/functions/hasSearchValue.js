function hasSearchValue({input, result}) {
  if (input.value) {
    return result.true();
  }

  return result.false();
}

export default hasSearchValue;
