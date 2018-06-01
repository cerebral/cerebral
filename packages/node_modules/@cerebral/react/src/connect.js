function connect(HOC, dependencies, mergeProps, component) {
  if (mergeProps && !component) {
    component = mergeProps
    mergeProps = null
  } else if (!mergeProps && !component) {
    component = dependencies
    dependencies = {}
    mergeProps = null
  }

  return HOC(dependencies, mergeProps, component)
}

export default (HOC) => (dependencies, mergeProps, component) =>
  connect(
    HOC,
    dependencies,
    mergeProps,
    component
  )

export const decoratorFactory = (HOC) => (dependencies) => (component) =>
  connect(
    HOC,
    dependencies
  )(component)
