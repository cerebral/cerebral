import UserAgentParser from 'user-agent-parser'

const parser = new UserAgentParser()
parser.setUA(navigator.userAgent)

export default {
  getBrowser: parser.getBrowser.bind(parser),
  getDevice: parser.getDevice.bind(parser),
  getOs: parser.getOS.bind(parser)
}
