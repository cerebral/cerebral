let setFilter = function(args, state) {
  const filter = args.fragments[0] === '' ? 'all' : args.fragments[0];
  state.set('filter', filter);
};

export default setFilter;
