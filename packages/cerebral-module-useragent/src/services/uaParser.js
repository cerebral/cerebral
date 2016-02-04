import UaParser from 'ua-parser-js'

const uaParser = new UaParser()
uaParser.setUA(navigator.userAgent)

export default {
  getBrowser: uaParser.getBrowser.bind(uaParser),
  getDevice: uaParser.getDevice.bind(uaParser),
  getOs: uaParser.getOS.bind(uaParser)
}
