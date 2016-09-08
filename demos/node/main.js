const runTask = require('./runTask')

runTask([
  function getRepoInfo(context) {
    return new Promise((resolve, reject) => {
      context.request({
        url: 'https://api.github.com/orgs/cerebral/repos',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'node'
        }
      }, (err, response, body) => {
        if (err) {
          reject(context.path.error({error: err.message}))
        } else {
          resolve(context.path.success({issues: JSON.parse(body)}))
        }
      })
    })
  }, {
    success: [
      function logRepoInfo(context) {
        
      }
    ],
    error: [

    ]
  }
])
