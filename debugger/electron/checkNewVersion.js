const packageJson = require('../package.json')
const net = require('electron').net

module.exports = function checkNewVersion () {
  return new Promise((resolve, reject) => {
    const request = net.request('https://raw.githubusercontent.com/cerebral/cerebral/master/debugger/package.json')
    request.on('response', (response) => {
      if (response.statusCode === 200) {
        let body = ''
        response.on('data', (chunk) => {
          body += chunk
        })
        response.on('end', () => {
          resolve({
            current: packageJson.version,
            new: JSON.parse(body).version
          })
        })
      }
    })
    request.end()
  })
}
