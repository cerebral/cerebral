export default function parseUserAgent ({state, services, module}) {
  Object.keys(module.meta.options.parse)
  .filter(isEnabled)
  .forEach(key => {
    const parseFunction = getParseFunction(key, services.useragent.parser)

    if (typeof parseFunction !== 'function') {
      throw new Error(`Parsing the ${key} from useragent is not supported.`)
    }

    state.set(['useragent', key], parseFunction.call(services.useragent.parser))
  })

  function isEnabled (key) {
    return module.meta.options.parse[key] === true
  }
}

function getParseFunction (prop, parser) {
  const parseFunctionName = getParseFunctionName(prop)
  return parser[parseFunctionName]
}

function getParseFunctionName (prop) {
  return `get${prop.charAt(0).toUpperCase() + prop.slice(1)}`
}
