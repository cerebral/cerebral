function setSaving ({state, module}) {
  state.set([module, 'isSaving'], true);
};

export default setSaving;
