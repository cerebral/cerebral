function setTitle ({input, state, module}) {
  module.state.set(['title'], input.title);
};

export default setTitle;
