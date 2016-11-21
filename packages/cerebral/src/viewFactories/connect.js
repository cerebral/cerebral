function connect (HOC, paths, passedSignals, injectedProps, passedComponent) {
  let component = passedComponent
  let signals = passedSignals
  let props = injectedProps

  if (arguments.length === 4) {
    component = props
    props = null
  } else if (arguments.length === 3) {
    component = signals
    signals = null
  }

  return HOC(paths, signals, props, component)
}

export default HOC => (...args) => connect(HOC, ...args)

export const decoratorFactory = (HOC) => (...args) => (component) => connect(HOC, ...args, component)
