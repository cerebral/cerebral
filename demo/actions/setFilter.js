function setFilter (args, state) {
  state.set('filter', args.route.params.filter);
};

export default setFilter;
