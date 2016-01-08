function unsetFilter ({state, module}) {
  module.state.set(['filter'], 'all');
};

export default unsetFilter;
