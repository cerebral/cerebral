function setFilter ({input, module}) {
  module.state.set(['filter'], input.filter);
};

export default setFilter;
