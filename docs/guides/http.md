# Http

Most applications needs some sort of requests going to a server. With Cerebral you choose your favourite library and expose it as a provider. By exposing it as a provider Cerebral will be able to track its usage and you can be more specific about how the library should work for your application.

## Using axios

[Axios documentation](https://www.npmjs.com/package/axios)

```js
import axios from 'axios'

export const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete
}
```

In this scenario we are just exposing the library methods we are going to use in our application, that might be enough. Or maybe you want to have an additional custom request, which is what the default export of axios provides:

```js
import axios from 'axios'

export const http = {
  request: axios,
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete
}
```

You might want to intercept the usage to include a default header:

```js
import axios from 'axios'

function withDefaultHeaders (config) {
  return {
     ...config,
     headers: {
       ...config.headers || {},
       'my special header': 'awesome'
     }
   }
}

export const http = {
  request(config) {
   return axios(withDefaultHeaders(config)) 
  },
  get(url, config) {
    return axios.get(url, withDefaultHeaders(config))
  },
  post(url, data, config) {
    return axios.post(url, data, withDefaultHeaders(config))
  },
  ...
}
```

And maybe this should be a token you want to set when the application loads:

```js
import axios from 'axios'

let token

function withDefaultHeaders (config) {
  return {
     ...config,
     headers: {
       ...config.headers || {},
       'Authorization': `bearer ${token}`
     }
   }
}

export const http = {
  setToken(newToken) {
    token = newToken
  }
  request(config) {
   return axios(withDefaultHeaders(config)) 
  },
  get(url, config) {
    return axios.get(url, withDefaultHeaders(config))
  },
  post(url, data, config) {
    return axios.post(url, data, withDefaultHeaders(config))
  },
  ...
}
```

Though this token might be from local storage. Lets say you have a provider to talk to local storage and you just grab the token from there. This is another good example, cause you very likely want to JSON stringify/parse data in your local storage:

```js
import axios from 'axios'

export const localStorage = {
  get(key) {
    return JSON.parse(localStorage.getItem(key))
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

// We use an IIFE to encapsulate our provider
export const http = (() => {
  function withDefaultHeaders (config, token) {
    return {
      ...config,
      headers: {
        ...config.headers || {},
        'Authorization': `bearer ${token}`
      }
    }
  }

  return {
    request(config) {
      const token = this.context.localStorage.get('token')
      return axios(withDefaultHeaders(config, token)) 
    },
    get(url, config) {
      const token = this.context.localStorage.get('token')
      return axios.get(url, withDefaultHeaders(config, token))
    },
    post(url, data, config) {
      const token = this.context.localStorage.get('token')
      return axios.post(url, data, withDefaultHeaders(config, token))
    },
    ...
  }
})()
```

As you can see there are many ways to put a provider together. It totally depends on your application what makes sense. What to also take note of here is that **http** could be completely replaced with a new provider exposing the same API.

## Using fetch

We could also just use the native fetch implementation to create our provider. Let us keep the signature and replace the code:

```js
import axios from 'axios'

export const localStorage = {
  get(key) {
    return JSON.parse(localStorage.getItem(key))
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

// We use an IIFE to encapsulate our provider
export const http = (() => {
  function withDefaultHeaders (config, token) {
    return {
      ...config,
      headers: {
        ...config.headers || {},
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
      }
    }
  }

  function evaluateResponse (response) {
    if (response.status >= 200 && response.status < 300) {
      return response.toJSON()
    }

    return Promise.reject(response)
  }

  return {
    request(config = {}) {
      const token = this.context.localStorage.get('token')
      return fetch(config.url, withDefaultHeaders(config, token))
        .then(evaluateResponse)
    },
    get(url, config = {}) {
      const token = this.context.localStorage.get('token')
      config.url = url
      return fetch(url, withDefaultHeaders(config, token))
        .then(evaluateResponse)

    },
    post(url, data, config = {}) {
      const token = this.context.localStorage.get('token')
      config.url = url
      config.method = 'POST'
      config.body = JSON.stringify(data)

      return fetch(url, withDefaultHeaders(config, token))
        .then(evaluateResponse)
    },
    ...
  }
})()
```

Now our application works the same way, but we replaced the tool that performs the logic. This gives you a lot of flexibility in how you want to deal with requests.

## Specific API

You could also be more specific about how we expose running requests from your application. We could simply replace the signature to:

```js
import qs from 'query-string'

export const api = (() => {
  const baseUrl = '/api'
  const http = {
    get (url, query = {}) {
      const queryString = qs.stringify(query)
      return fetch(baseUrl + url + (queryString ? '?' + queryString : '')
        .then(response => response.toJSON())
    }
  }

  return {
    getUser (id) {
      return http.get(`/users/${id}`)
    },
    getItems (query) {
      return http.get(`/items`, query)
    },
    getItem (id) {
      return http.get(`/items/${id}`)
    }
  }
})()
```

This approach gives you a more specific API in your actual application.