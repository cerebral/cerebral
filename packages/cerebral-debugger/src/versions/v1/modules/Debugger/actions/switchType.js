function switchType ({input, path}) {
  return path[input.type]()
}

export default switchType
