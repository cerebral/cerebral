'use strict'

function getCerebralMembers (context) {
  return new Promise((resolve, reject) => {
    context.request({
      url: 'https://api.github.com/orgs/cerebral/members',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'node'
      }
    }, (err, response, body) => {
      if (err) {
        reject(context.path.error({error: err.message}))
      } else {
        resolve(context.path.success({members: JSON.parse(body)}))
      }
    })
  })
}

module.exports = getCerebralMembers
