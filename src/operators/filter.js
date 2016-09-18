import parseScheme from 'cerebral-scheme-parser'
import populateInputAndModelSchemes from './helpers/populateInputAndModelSchemes'

export default function(passedPath, filterFunc) {
  const pathScheme = parseScheme(passedPath)

  const filterValue = typeof filterFunc === 'function'
    ? filterFunc
    : (value) => value === filterFunc

  if (pathScheme.target !== 'model' && pathScheme.target !== 'input') {
    throw new Error('Cerebral operator FILTER - The path: "' + passedPath + '" does not target "state" or "input"')
  }

  // define the action
  const filter = function({input, model, path}) {
    const pathValue = pathScheme.getValue(populateInputAndModelSchemes(input, model))
    let value

    if (pathScheme.target === 'input') {
      value = input[pathValue]
    } else if (pathScheme.target === 'state') {
      value = model.get(pathValue)
    }

    return filterValue(value) ? path.accepted() : path.discarded()
  }

  filter.displayName = 'operator FILTER'

  return filter
}
