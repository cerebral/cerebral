export default function detectFeatures ({module}) {
  const options = module.meta.options.feature

  let featureMap = {}

  Object.keys(module.services.feature)
  .filter(isEnabled)
  .reduce((result, featureName) => {
    result[featureName] = module.services.feature[featureName]
    return result
  }, featureMap)

  if (options === Object(options)) {
    Object.keys(options)
    .filter(isCustomTest)
    .reduce((result, featureName) => {
      result[featureName] = options[featureName].call()
      return result
    }, featureMap)
  }

  function isEnabled (featureName) {
    if (typeof options === 'object') {
      return options[featureName] === true
    }

    return options
  }

  function isCustomTest (featureName) {
    return typeof options[featureName] === 'function'
  }

  module.state.set(['feature'], featureMap)
}
