function switchType({input, output}) {
  output[input.type]();
}

switchType.outputs = ['init', 'execution', 'executionChange', 'components', 'recorderMutation'];

export default switchType;
