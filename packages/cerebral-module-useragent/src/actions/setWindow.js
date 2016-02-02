export default function setWindow ({module}) {
  module.state.set(['window'], module.services.window.getSpecs())
}
