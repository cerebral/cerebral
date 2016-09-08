function copyInputToDataFactory(inputProp, dataProp) {
  function copyInputToData({input, data}) {
    data.set(dataProp, input[inputProp]);
  }

  return copyInputToData;
}

export default copyInputToDataFactory;
