let setFilter = function(args, state) {
  let filter =
    args.pathname.indexOf('/#/active') !== -1 ?
    'active' : args.pathname.indexOf('/#/completed') !== -1 ?
    'completed' : 'all';
  state.set('filter', filter);
};

export default setFilter;
