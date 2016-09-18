import parseScheme from 'cerebral-scheme-parser'
import populateInputAndModelSchemes from './helpers/populateInputAndModelSchemes'

export default function(path, value) {
  const pathScheme = parseScheme(path)

  if (pathScheme.target !== 'model') {
    throw new Error('Cerebral operator SET - The path: "' + path + '" does not target "model"')
  }

  const set = function set({input, model}) {
    const pathValue = pathScheme.getValue(populateInputAndModelSchemes(input, model))

    model.set(pathValue, value)
  }

  set.displayName = 'operator SET'

  return set
}
