import parseScheme from 'cerebral-scheme-parser'
import populateInputAndStateSchemes from './helpers/populateInputAndStateSchemes'

export default function(path, onValue = true, offValue = false) {
  const pathScheme = parseScheme(path)

  if (pathScheme.target !== 'state') {
    throw new Error('Cerebral operator TOGGLE - The path: "' + path + '" does not target "state"')
  }

  const toggle = function toggleRead({input, state}) {
    const pathValue = pathScheme.getValue(populateInputAndStateSchemes(input, state))
    const currentValue = state.get(pathValue)

    state.set(pathValue, currentValue === onValue ? offValue : onValue)
  }

  toggle.displayName = 'operator TOGGLE'

  return toggle
}
