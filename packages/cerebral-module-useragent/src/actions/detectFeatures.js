export default function detectFeatures ({module}) {
  module.state.set(['features'], module.services.features.detectAll())
}
