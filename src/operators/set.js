import parseScheme from 'cerebral-scheme-parser'
import populateInputAndStateSchemes from './helpers/populateInputAndStateSchemes'

export default function (path, value) {
  const pathScheme = parseScheme(path)
  const valueScheme = typeof value === 'string' ? parseScheme(value) : value

  if (pathScheme.target !== 'state') {
    throw new Error('Cerebral operator SET - The path: "' + path + '" does not target "state"')
  }

  if (valueScheme.target && valueScheme.target !== 'input') {
    throw new Error('Cerebral operator SET - The value: "' + path + '" does not target "input"')
  }

  const set = function set ({input, state}) {
    const pathSchemeValue = pathScheme.getValue(populateInputAndStateSchemes(input, state))
    const valueSchemeValue = (
      valueScheme.target
        ? input[valueScheme.getValue(populateInputAndStateSchemes(input, state))]
        : value
    )

    state.set(pathSchemeValue, valueSchemeValue)
  }

  set.displayName = 'operator SET'

  return set
}
