import HOC from './hoc'

export default function connect (paths, passedSignals, passedComponent) {
  let component = passedComponent
  let signals = passedSignals

  if (arguments.length === 2) {
    component = signals
    signals = null
  }

  if (!component) {
    return function (decoratedComponent) {
      return process.env.NODE_ENV === 'test' ? decoratedComponent : HOC(paths, signals, decoratedComponent)
    }
  }

  return process.env.NODE_ENV === 'test' ? component : HOC(paths, signals, component)
}
