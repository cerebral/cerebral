function connect (HOC, dependencies, injectedProps, passedComponent) {
  let component = passedComponent
  let props = injectedProps

  if (arguments.length === 3) {
    component = props
    props = null
  }

  return HOC(dependencies, props, component)
}

export default HOC => (...args) => connect(HOC, ...args)

export const decoratorFactory = (HOC) => (...args) => (component) => connect(HOC, ...args, component)
