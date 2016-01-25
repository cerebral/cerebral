function setFilter ({input, module}) {
  module.state.set(['filter'], input.filter || 'all');
};

export default setFilter;
