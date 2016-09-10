function copyInputToDataFactory(inputProp, dataProp) {
  function copyInputToData({input, data}) {
    data[dataProp] = input[inputProp];
  }

  return copyInputToData;
}

export default copyInputToDataFactory;
