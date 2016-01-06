function setFilter ({input, state, module}) {
  state.set([module, 'filter'], input.filter);
};

export default setFilter;
