function updateModel({input, state}) {
  state.set(['debugger', 'model'].concat(input.path), input.value);
}

export default updateModel;
