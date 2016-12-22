import populatePath from './helpers/populatePath'

export default function input (strings, ...values) {
  console.warn('Importing input from cerebral/operators is deprecated, import it from cerebral/tags')
  return (context) => {
    const target = 'input'
    const path = populatePath(context, strings, values)

    return {
      target,
      path,
      value: path.split('.').reduce((currentValue, key) => {
        return currentValue[key]
      }, context.input)
    }
  }
}
