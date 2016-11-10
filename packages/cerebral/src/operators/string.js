import populatePath from './helpers/populatePath'

export default function string (strings, ...values) {
  return (context) => {
    const target = 'string'
    const path = populatePath(context, strings, values)

    return {
      target,
      path,
      toValue () {
        return path
      }
    }
  }
}
