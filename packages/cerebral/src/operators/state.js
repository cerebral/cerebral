import populatePath from './helpers/populatePath'

export default function state (strings, ...values) {
  console.warn('Importing state from cerebral/operators is deprecated, import it from cerebral/tags')
  return (context) => {
    const target = 'state'
    const path = populatePath(context, strings, values)

    return {
      target,
      path,
      value: context.state.get ? context.state.get(path) : context.state(path)
    }
  }
}
