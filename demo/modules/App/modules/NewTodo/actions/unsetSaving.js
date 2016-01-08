function unsetSaving ({state, module}) {
  module.state.set(['isSaving'], false);
};

export default unsetSaving;
