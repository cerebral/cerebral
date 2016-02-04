export default function setWindow ({state, services, module}) {
  state.set(['window'], services.useragent.window.getSpecs())
}
