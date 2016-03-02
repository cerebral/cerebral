export default function setOffline ({input, state, module}) {
  const moduleState = state.select(module.path)

  moduleState.set(['network', 'offline'], input.offline)
}
