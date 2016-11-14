function updateComponentsMap({ input, state }) {
  state.set('debugger.componentsMap', input.data.map);
}

export default updateComponentsMap;
