# cerebral-http
HTTP Provider for Cerebral2
Based on prior art from cerebral-module-http

### How to use
```js
import { Controller } from 'cerebral';
import { Container } from 'cerebral/react';
import { HttpProvider } from 'cerebral-http';

const controller = Controller({
  state: {
    libName: 'Cerebral',
    githubUser: ''
  },
  providers: [
    HttpProvider({
      baseUrl: 'https://api.github.com'
    })
  ],
  signals: {
    getUser: [getGithubUser, setData]
  }
})

controller.getSignal("getUser")()

function getGithubUser({state, http}) {
  return http.get("/users/fopsdev")
    .then(response => ({
      result: response.result
    }))
    .catch(error => ({
      error: error.response.data
    }))
}

function setData({input, state}) {
  state.set('githubUser', input.result)
  console.log(state.get('githubUser'))
}
```

