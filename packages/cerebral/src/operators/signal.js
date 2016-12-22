import populatePath from './helpers/populatePath'

export default function signal (strings, ...values) {
  console.warn('Importing signal from cerebral/operators is deprecated, import it from cerebral/tags')
  return (context) => {
    const target = 'signal'
    const path = populatePath(context, strings, values)

    return {
      target,
      path,
      value: context.controller ? context.controller.getSignal(path) : context.signal(path)
    }
  }
}
