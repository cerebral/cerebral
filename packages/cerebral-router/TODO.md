# Support API for Array and Object, with single string shortcut

This makes it backwards compatible with current router API.

```js
{ '/foo': {signal: 'app.foo'}
, '/bar': {signal: 'app.bar'}
}

// or

{ '/foo': 'app.foo'
, '/bar': 'app.bar'
}

// or

[ { path: '/foo', signal: 'app.foo'}
, { path: '/bar', signal: 'app.bar'}
}
```

# Split tests in separate files (christianalfoni)

  - baseUrl (contains basic query tests)
  - onlyHash (contains basic query tests)
  - baseUrlAndOnlyHash (contains basic query tests)
  - query

  - urlToState
  - stateToUrl
