function switchType({input, output}) {
  output[input.type]();
}

switchType.outputs = ['init', 'execution', 'executionChange', 'components'];

export default switchType;
