import objectPath from 'object-path'

export default function detectFeatures ({state, services, module}) {
  const options = module.meta.options.feature
  const uaFeatures = objectPath.get(services, [...module.path, 'feature'])
  const moduleState = state.select(module.path)

  let featureMap = {}

  Object.keys(uaFeatures)
  .filter(isEnabled)
  .reduce((result, featureName) => {
    result[featureName] = uaFeatures[featureName]
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

  moduleState.set(['feature'], featureMap)
}
