let setFilter = function(cerebral, route) {
  let filter =
    route.pathname === '/#/active' ?
    'active' : route.pathname === '/#/completed' ?
    'completed' : 'all';
  cerebral.set('filter', filter);
};

export default setFilter;
