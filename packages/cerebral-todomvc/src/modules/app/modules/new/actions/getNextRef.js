function getNextRef ({ output, state, services }) {
  output({ ref: services.refs.next() })
}

export default getNextRef
