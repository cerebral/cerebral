import objectPath from 'object-path'

export default function parseUserAgent ({state, services, module}) {
  const options = module.meta.options.parse
  const uaParser = objectPath.get(services, [...module.path, 'parser'])
  const moduleState = state.select(module.path)

  Object.keys(options)
  .filter(isEnabled)
  .forEach(key => {
    const parseFunction = getParseFunction(key, uaParser)

    if (typeof parseFunction !== 'function') {
      throw new Error(`Parsing the ${key} from useragent is not supported.`)
    }

    moduleState.set([key], parseFunction.call(uaParser))
  })

  function isEnabled (key) {
    return options[key] === true
  }
}

function getParseFunction (prop, uaParser) {
  const parseFunctionName = getParseFunctionName(prop)
  return uaParser[parseFunctionName]
}

function getParseFunctionName (prop) {
  return `get${prop.charAt(0).toUpperCase() + prop.slice(1)}`
}
