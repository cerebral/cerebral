import objectPath from 'object-path'
import {getSpecs} from '../helper/module'

export default function detectFeatures (context) {
  const {state, services, options, path} = getSpecs(context)
  const feature = options.feature
  const uaFeatures = objectPath.get(services, [...path, 'feature'])
  const moduleState = state.select(path)

  let featureMap = {}

  Object.keys(uaFeatures)
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

  moduleState.set(['feature'], featureMap)
}
