# What is Cerebral?

> A declarative **state and side effects management** solution for popular JavaScript frameworks

Writing your code **declaratively** means doing:

```js
&lt;h1 class="header"&gt;Hello&lt;/h1&gt;
```

Instead of:

```js
const h1 = document.createElement('h1')
h1.className = 'header'
document.body.appendChild(h1)
```

It makes perfect sense for us to write our UIs in a declarative manner. The reason is that we need to reuse UI elements and compose them together in different configurations. One can also claim that declarative code reads better, not just because it is less syntax, but because you only describe **what** you want, not **how** you want it.

But what about our business logic, can we get the same benefits there? This is how business logic can be expressed **declaratively**:

```js
[
  set(state`isLoadingUser`, true),
  httpGet('/user'), {
    success: set(state`user`, props`user`),
    error: set(state`error`, props`error`)
  },
  set(state`isLoadingUser`, false),
]
```

Instead of:

```js
function getUser() {
  this.isLoading = true
  ajax.get('/user')
    .then((user) => {
      this.data = user
      this.isLoading = false
    })
    .catch((error) => {
      this.error = error
      this.isLoading = false
    })
}
```

You might think this example tries to highlight "less lines of code", but that is just a result of these core properties:

- Composability
- Readability
- Reusability
- Testability

All these properties makes **better code**, there is no question about that, and the way we achieve it is through declarative code. **Read on to learn more about how Cerebral enforces these properties in your codebase**.
