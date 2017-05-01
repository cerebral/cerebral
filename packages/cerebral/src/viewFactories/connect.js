function connect (HOC, dependencies, mergeProps, passedComponent) {
  let component = passedComponent
  let props = mergeProps

  if (arguments.length === 3) {
    component = props
    props = null
  }

  return HOC(dependencies, props, component)
}

export default HOC => (...args) => connect(HOC, ...args)

export const decoratorFactory = (HOC) => (...args) => (component) => connect(HOC, ...args, component)
