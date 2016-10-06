require('feature.js')

export default function getFeatures(options) {
  const feature = options.feature
  const uaFeatures = window.feature

  let featureMap = {}

  Object.keys(uaFeatures)
  .filter(isTestResult)
  .filter(isEnabled)
  .reduce((result, featureName) => {
    result[featureName] = uaFeatures[featureName]
    return result
  }, featureMap)

  if (feature === Object(feature)) {
    Object.keys(feature)
    .filter(isCustomTest)
    .reduce((result, featureName) => {
      result[featureName] = feature[featureName].call()
      return result
    }, featureMap)
  }

  function isEnabled (featureName) {
    if (typeof feature === 'object') {
      return feature[featureName] === true
    }

    return feature
  }

  function isCustomTest (featureName) {
    return typeof feature[featureName] === 'function'
  }

  function isTestResult (featureName) {
    return typeof uaFeatures[featureName] === 'boolean'
  }

  return featureMap
}
