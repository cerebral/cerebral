function getNextRef ({ output, services }) {
  output({ ref: services.refs.next() })
}

export default getNextRef
