export default function parseUserAgent ({module}) {
  Object.keys(module.meta.options.parse)
  .filter(key => isEnabled)
  .forEach(key => {
    const parseFunction = getParseFunction(key, module)

    if (typeof parseFunction !== 'function') {
      throw new Error(`Parsing the ${key} from useragent is not supported.`)
    }

    module.state.set([key], parseFunction.call(module.services.parser))
  })

  function isEnabled (key) {
    return module.meta.options.parse[key] === true
  }
}

function getParseFunction (prop, module) {
  const parseFunctionName = getParseFunctionName(prop)
  return module.services.parser[parseFunctionName]
}

function getParseFunctionName (prop) {
  return `get${prop.charAt(0).toUpperCase() + prop.slice(1)}`
}
