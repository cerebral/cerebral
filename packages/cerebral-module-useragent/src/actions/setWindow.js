import objectPath from 'object-path'

export default function setWindow ({state, services, module}) {
  const window = objectPath.get(services, [...module.path, 'window'])
  const moduleState = state.select(module.path)

  moduleState.set(['window'], window.getSpecs())
}
