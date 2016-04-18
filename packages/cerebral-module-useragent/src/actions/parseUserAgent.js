import objectPath from 'object-path'
import {getSpecs} from '../helper/module'

export default function parseUserAgent (context) {
  const {state, services, options, path} = getSpecs(context)
  const parse = options.parse
  const uaParser = objectPath.get(services, [...path, 'uaParser'])
  const moduleState = state.select(path)

  Object.keys(parse)
  .filter(isEnabled)
  .forEach((key) => {
    const parseFunction = getParseFunction(key, uaParser)

    if (typeof parseFunction !== 'function') {
      throw new Error(`Parsing the ${key} from useragent is not supported.`)
    }

    moduleState.set([key], parseFunction.call(uaParser))
  })

  function isEnabled (key) {
    return parse[key] === true
  }
}

function getParseFunction (prop, uaParser) {
  const parseFunctionName = getParseFunctionName(prop)
  return uaParser[parseFunctionName]
}

function getParseFunctionName (prop) {
  return `get${prop.charAt(0).toUpperCase() + prop.slice(1)}`
}
