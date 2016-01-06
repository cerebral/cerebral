function unsetSaving ({state, module}) {
  state.set([module, 'isSaving'], false);
};

export default unsetSaving;
