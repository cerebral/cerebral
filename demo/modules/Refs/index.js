export default (options = {}) => {
  return (module) => {

    module.alias('cerebral-module-refs');

    module.state({
      nextRef: 0
    });

    module.service('next', (state) => {
      const nextId = state.get([module.name, 'nextRef']);
      state.set([module.name, 'nextRef'], nextId + 1);
      return nextId;
    });

  };
}
