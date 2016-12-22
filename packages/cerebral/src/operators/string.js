import populatePath from './helpers/populatePath'

export default function string (strings, ...values) {
  console.warn('Importing string from cerebral/operators is deprecated, import it from cerebral/tags')
  return (context) => {
    const target = 'string'
    const path = populatePath(context, strings, values)

    return {
      target,
      path,
      value: path
    }
  }
}
