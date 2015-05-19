let setFilter = function(cerebral, route) {
  let filter =
    route.pathname.indexOf('/#/active') !== -1 ?
    'active' : route.pathname.indexOf('/#/completed') !== -1 ?
    'completed' : 'all';
  cerebral.set('filter', filter);
};

export default setFilter;
