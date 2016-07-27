# cerebral-module-http
HTTP module for Cerebral

### How to use
Go to [http://www.cerebraljs.com/documentation/cerebral-module-http](http://www.cerebraljs.com/documentation/cerebral-module-http)

### Technical details
This project is implemented using [Axios](https://github.com/mzabriskie/axios) as it exposes a promise based API. Any options passed into this module is passed directly to Axios.

The only factory exposed is `httpGet` as it typically has no dynamic path.

### Contribute
1. Clone repo
2. `npm link`
3. Test using the tutorial projects or the CLI
4. `npm link cerebral-module-http`

There are no tests here as it is a very simple implementation.
