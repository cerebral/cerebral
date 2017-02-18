function switchType ({props, path}) {
  return path[props.type]()
}

export default switchType
