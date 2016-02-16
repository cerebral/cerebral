function setTitle ({input, state}) {
  state.set('app.new.title', input.title);
};

export default setTitle;
