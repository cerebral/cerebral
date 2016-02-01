export default function setScreenSpecs ({module}) {
  module.state.set(['screen'], module.services.screen.getSpecs())
}
