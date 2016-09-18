import parseScheme from 'cerebral-scheme-parser'
import populateInputAndModelSchemes from './helpers/populateInputAndModelSchemes'

function whenFactory(passedPath, continueChain) {
  const pathScheme = parseScheme(passedPath)

  if (pathScheme.target !== 'model' && pathScheme.target !== 'input') {
    throw new Error('Cerebral operator WHEN - The path: "' + passedPath + '" does not target "input" or "model"')
  }

  // define the action
  const when = function({input, model, path}) {
    const pathValue = pathScheme.getValue(populateInputAndModelSchemes(input, model))
    let value

    if (pathScheme.target === 'input') {
      value = input[pathValue]
    } else if (pathScheme.target === 'model') {
      value = model.get(pathValue)
    }

    return Boolean(value) ? path.accepted() : path.discarded()
  }

  when.displayName = `operator WHEN (${passedPath})`

  return [
    when, {
      accepted: continueChain,
      discarded: []
    }
  ]
}

export default whenFactory
