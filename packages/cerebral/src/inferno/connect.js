import HOC from './hoc'

export default function connect (paths, passedSignals, injectedProps, passedComponent) {
  let component = passedComponent
  let signals = passedSignals
  let props = injectedProps

  if (arguments.length === 3) {
    component = props
    props = null
  } else if (arguments.length === 2) {
    component = signals
    signals = null
  }

  if (!component) {
    return function (decoratedComponent) {
      return HOC(paths, signals, props, decoratedComponent)
    }
  }

  return HOC(paths, signals, props, component)
}
