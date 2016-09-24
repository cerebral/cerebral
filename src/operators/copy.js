import parseScheme from 'cerebral-scheme-parser'
import populateInputAndStateSchemes from './helpers/populateInputAndStateSchemes'

export default function(fromPath, toPath) {
  const fromPathScheme = parseScheme(fromPath)
  const toPathScheme = parseScheme(toPath)

  if (fromPathScheme.target !== 'input' && fromPathScheme.target !== 'state') {
    throw new Error('Cerebral operator COPY - The path: "' + fromPath + '" is not valid, you have to give it a "state" or "input" target')
  }

  const copy = function({input, state}) {
    const fromPathValue = fromPathScheme.getValue(populateInputAndStateSchemes(input, state))
    const toPathValue = toPathScheme.getValue(populateInputAndStateSchemes(input, state))
    const fromValue = input[fromPathValue]

    state.set(toPathValue, fromValue)
  }

  copy.displayName = 'operator COPY'
  return copy
}
