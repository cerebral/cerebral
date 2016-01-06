function unsetFilter ({state, module}) {
  state.set([module, 'filter'], 'all');
};

export default unsetFilter;
