function setTitle ({input, state, module}) {
  state.set([module, 'title'], input.title);
};

export default setTitle;
