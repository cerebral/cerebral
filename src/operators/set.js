import parseScheme from 'cerebral-scheme-parser'
import populateInputAndStateSchemes from './helpers/populateInputAndStateSchemes'

export default function(path, value) {
  const pathScheme = parseScheme(path)

  if (pathScheme.target !== 'state') {
    throw new Error('Cerebral operator SET - The path: "' + path + '" does not target "state"')
  }

  const set = function set({input, state}) {
    const pathValue = pathScheme.getValue(populateInputAndStateSchemes(input, state))

    state.set(pathValue, value)
  }

  set.displayName = 'operator SET'

  return set
}
