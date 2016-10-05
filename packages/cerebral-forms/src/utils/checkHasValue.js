import rules from '../rules'

function parseKey (value) {
  if (typeof value === 'string') {
    const args = value.split(/:(.+)?/)

    return args[1] ? {key: args[0], params: JSON.parse(args[1])} : {key: value}
  }

  return {key: value}
}

export default function checkHasValue (form, value, isValueRules) {
  return isValueRules.reduce((isValue, key) => {
    if (!isValue) {
      return false
    }
    const parsedKey = parseKey(key)

    return rules[parsedKey.key](value, form, parsedKey.params)
  }, true)
}
