import populatePath from './helpers/populatePath'

export default function signal (strings, ...values) {
  return (context) => {
    const target = 'signal'
    const path = populatePath(context, strings, values)

    return {
      target,
      path,
      value: context.controller.getSignal(path)
    }
  }
}
