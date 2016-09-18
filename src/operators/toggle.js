import parseScheme from 'cerebral-scheme-parser'
import populateInputAndModelSchemes from './helpers/populateInputAndModelSchemes'

export default function(path, onValue = true, offValue = false) {
  const pathScheme = parseScheme(path)

  if (pathScheme.target !== 'model') {
    throw new Error('Cerebral operator TOGGLE - The path: "' + path + '" does not target "model"')
  }

  const toggle = function toggleRead({input, model}) {
    const pathValue = pathScheme.getValue(populateInputAndModelSchemes(input, model))
    const currentValue = model.get(pathValue)

    model.set(pathValue, currentValue === onValue ? offValue : onValue)
  }

  toggle.displayName = 'operator TOGGLE'

  return toggle
}
