# cerebral-provider-http
HTTP Provider for Cerebral2
Based on prior art from [cerebral-module-http](https://github.com/cerebral/cerebral-module-http)

### Install
This project is still in alpha. To test alpha version check [instructions in monorepo](https://github.com/cerebral/cerebral/blob/master/README.md).

### Instantiate

```js
import {Controller} from 'cerebral'
import HttpProvider from 'cerebral-provider-http'

const controller = Controller({
  providers: [
    HttpProvider({
      // Prefix all requests with this url
      baseUrl: 'https://api.github.com',

      // Any default headers to pass on requests
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json'
      },

      // When talking to cross origin (cors), pass cookies
      // if set to true
      withCredentials: false
    })
  ]
})
```

You can update these default options in an action:

```js
function updateDefaultHttpOptions({http}) {
  http.updateOptions({
    // Updated options
  })
}
```

### Request

#### Custom request

```js
function someGetAction ({http}) {
  return http.request({
    // Any http method
    method: 'GET',

    // Url you want to request to
    url: '/items'

    // Request body as object. Will automatically be stringified if json and
    // urlEncoded if application/x-www-form-urlencoded
    body: {},

    // Query as object, will automatically be urlEncoded
    query: {},

    // If cross origin request, pass cookies
    withCredentials: false,

    // Any additional http headers, or overwrite default
    headers: {},

    // A function or signal path (foo.bar.requestProgressed) that
    // triggers on request progress. Passes {progress: 45} etc.
    onProgress: null
  })
}
```

#### Convenience methods

```js
function someGetAction ({http}) {
  return http.get('/items', {
    // QUERY object
  }, {
    // Any options defined in "Custom request"
  })
}

function somePostAction ({http}) {
  return http.post('/items', {
    // BODY object
  }, {
    // Any options defined in "Custom request"
  })
}

function somePutAction ({http}) {
  return http.put('/items/1', {
    // BODY object
  }, {
    // Any options defined in "Custom request"
  })
}

function somePatchAction ({http}) {
  return http.patch('/items/1', {
    // BODY object
  }, {
    // Any options defined in "Custom request"
  })
}

function someDeleteAction ({http}) {
  return http.delete('/items/1', {
    // QUERY object
  }, {
    // Any options defined in "Custom request"
  })
}
```

#### Factories
```js
import {httpGet, httpPost, httpPut, httpPatch, httpDelete} from 'cerebral-provider-http'
import {string, input, state} from 'cerebral/operators'

export default [
  // Static
  httpGet('/items'), {
    success: [],
    error: []
  },
  // Dynamic
  httpGet(string`/items/${input`itemId`}`), {
    success: [],
    error: []
  },
  // Pass data, either query or body, depending on factory used
  httpPost('/items', {
    title: input`itemTitle`,
    foo: 'bar'
  }), {
    success: [],
    error: []
  },
  // You can handle aborted if you use that functionality
  httpPut('/items'), {
    success: [],
    error: [],
    abort: []
  },
  // They all have this functionality
  httpPatch(string`/items/${input`itemId`}`, state`patchData`), {
    success: [],
    error: []
  },
  // Kinda cool? :)
  httpDelete(string`/items/${state`currentItemId`}`), {
    success: [],
    error: []
  }
]
```

To check the response for a specific http status code, simply use the code for the path name and it will be called when the response code matches.

```js
export default [
  httpPut('/items/1', { title: 'updated' }), {
    '201': [],
    success: [], // all other success codes will call this path
    '401': [],
    error: [] // all other error codes will call this path
  }
]
```

### Response

```js
function someGetAction ({http}) {
  return http.get('/items')
    // All status codes between 200 - 300, including 200
    .then((response) => {
      response.status // Status code of response
      response.result // Parsed response text
      // The response headers are returned as an object with lowercase header
      // names as keys. Values belonging to the same key are separated by ', '.
      response.headers // Parsed response headers
    })
    // All other status codes
    .catch((response) => {
      response.status // Status code of response
      response.result // Parsed response text
      response.headers // Parsed response headers
    })
}
```

### Abort request
You can abort any running request, causing the request to resolve as status code **0** and set an **isAborted** property on the response object.

```js
function searchItems({input, state, path, http}) {
  http.abort('/items*') // regexp string
  return http.get(`/items?query=${input.query}`)
    .then(path.success)
    .catch((response) => {
      if (response.isAborted) {
        return path.abort()
      }

      return path.error(response)
    })
}

export default [
  searchItems, {
    success: [],
    error: [],
    abort: []
  }
]
```

### Cors
Cors has been turned into a "black box" by jQuery. Cors is actually a very simple concept, but due to a lot of confusion of "Request not allowed", **cors** has been an option to help out. In HttpProvider we try to give you the insight to understand how cors actually works.

Cors has nothing to do with the client. The only client configuration related to cors is the **withCredentials** option, which makes sure cookies are passed to the cross origin server. The only requirement for cors to work is that you pass the correct **Content-Type**. Now, this depends on the server in question. Some servers allows any content-type, others require a specific one. These are the typical ones:

- text/plain
- application/x-www-form-urlencoded
- application/json; charset=UTF-8

Note that this is only related to the **request**. If you want to define what you want as response, you set the **Accept** header, which is *application/json* by default.

### File upload
Since Cerebral can only use serializable data in signals and the state tree, any file uploads must happen in components.

```js
import {FileUpload} from 'cerebral-provider-http'

export default connect({
  fileNames: 'app.fileNames'
}, {
  filesAdded: 'app.filesAdded',
  uploadStarted: 'app.uploadStarted',
  uploadProgressed: 'app.uploadProgressed',
  uploadFinished: 'app.uploadFinished',
  uploadFailed: 'app.uploadFailed'
},
  class UploadFile extends Component {
    constructor (props) {
      super(props);
      this.filesToUpload = [];
    }
    onFilesChange (event) {
      this.filesToUpload = event.target.files;
      this.props.filesAdded({
        fileNames: this.filesToUpload.map(file => file.name)
      })
    }
    upload () {
      const fileUpload = new FileUpload({
        url: '/upload',
        headers: {},
        // Additional data on form. Do not use "file", it is taken
        data: {},
        // Triggers with object {progress: 54} and so on
        onProgress: this.props.uploadProgressed
      })

      this.props.uploadStarted()
      fileUpload.send(this.filesToUpload)
          .then(this.props.uploadFinished)
          .catch(this.props.uploadFailed)
    }
    render() {
      return (
        <h4>Please choose a file.</h4>
        <div>
          <input type="" onChange={(event) => this.onFilesChange(event)}/><br/><br/>
          <button disabled={this.filesToUpload.length === 0} onClick={() => this.upload()}>Upload</button>
        </div>
      )
    }
  }
)
```

You are also able to abort file uploads by calling fileUpload.abort(). This will result in a rejection of the send promise. The data passed will be: **{status: 0, result: null, isAborted: true}**.
