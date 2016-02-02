import UserAgentParser from 'user-agent-parser'

const parser = new UserAgentParser()
parser.setUA(navigator.userAgent)

export default parser
