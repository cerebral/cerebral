export default function setUserAgent ({module}) {
  module.state.set(['browser'], module.services.parser.getBrowser())
  module.state.set(['device'], module.services.parser.getDevice())
  module.state.set(['os'], module.services.parser.getOS())
}
