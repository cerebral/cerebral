import CerebralRouter from 'cerebral-router';

export default (routes = {}, options = {}) => {
  return (module, controller) => {
    CerebralRouter(controller, routes, options);
  }
}
