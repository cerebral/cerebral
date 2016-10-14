# cerebral-provider-http
HTTP Provider for Cerebral2
Based on prior art from [cerebral-module-http](https://github.com/cerebral/cerebral-module-http)

### Todos
Create npm install
Test FileUpload

### How to use
```js
import { Controller } from 'cerebral'
import HttpProvider from 'cerebral-provider-http'
import { FileUpload } from 'cerebral-provider-http'

const controller = Controller({
  state: {
    githubUser: {}
  },
  providers: [
    HttpProvider({
      baseUrl: 'https://api.github.com'
    })
  ],
  signals: {
    getUser: [getGithubUser, {
      success: [setData],
      error: [logError]
    }, [setUrlEncode, getGithubUser, {
      error: [checkError]
    }]]
  }
})

controller.getSignal("getUser")()

function getGithubUser({state, path, http}) {
  return http.get("/users/fopsdev")
    .then(response => path.success({
      result: response.result
    }))
    .catch(error => path.error({
      error: error
    }))
}

function setData({input, state}) {
  state.set('githubUser', input.result)
  let res = state.get('githubUser')
  if (res.login === 'fopsdev')
    console.log('basic http get test succeeded!')
}

function logError({input}) {
  console.warn('basic http get test failed :' + JSON.stringify(input.error))
}

function setUrlEncode({http}) {
  http.updateOptions({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// same get request but with content type urlencoded should end here
// not 100% safe i know but it is a test :)
function checkError({input}) {
  console.log('basic http get with urlencoded test succeeded')
}

// todo FileUpload Testing
// var fileUpload = FileUpload({
//   url: "http://posttestserver.com/post.php?dir=example"
// })
// console.log(fileUpload)
// fileUpload.send(wuuut?)
```
