function switchType ({path, props}) {
  return path[props.type]()
}

export default switchType
