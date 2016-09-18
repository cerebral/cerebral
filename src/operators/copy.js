import parseScheme from 'cerebral-scheme-parser'
import populateInputAndStateSchemes from './helpers/populateInputAndModelSchemes'

export default function(fromPath, toPath) {
  const fromPathScheme = parseScheme(fromPath)
  const toPathScheme = parseScheme(toPath)

  if (fromPathScheme.target !== 'input' && fromPathScheme.target !== 'model') {
    throw new Error('Cerebral operator COPY - The path: "' + fromPath + '" is not valid, you have to give it a "model" or "input" target')
  }

  const copy = function({input, model}) {
    const fromPathValue = fromPathScheme.getValue(populateInputAndStateSchemes(input, model))
    const toPathValue = toPathScheme.getValue(populateInputAndStateSchemes(input, model))
    const fromValue = input[fromPathValue]

    model.set(toPathValue, fromValue)
  }

  copy.displayName = 'operator COPY'
  return copy
}
