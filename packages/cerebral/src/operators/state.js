import populatePath from './helpers/populatePath'

export default function state (strings, ...values) {
  return (context) => {
    const target = 'state'
    const path = populatePath(context, strings, values)

    return {
      target,
      path,
      toValue () {
        return context.state.get(path)
      }
    }
  }
}
