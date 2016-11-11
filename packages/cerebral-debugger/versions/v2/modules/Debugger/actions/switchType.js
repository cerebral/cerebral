function switchType({input, output}) {
  output[input.type]();
}

switchType.outputs = [
  'init',
  'executionStart',
  'executionPathStart',
  'execution',
  'executionEnd',
  'components',
  'recorderMutation'
];

export default switchType;
