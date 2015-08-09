function setFilter (args, state) {
  const filter = args.params.filter || 'all';
  state.set('filter', filter);
};

export default setFilter;
