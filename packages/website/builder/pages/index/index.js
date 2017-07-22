import React from 'react'

function Index(props) {
  return (
    <div className="index-container">
      <div
        style={{
          background: 'url(/images/cerebral.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          width: '100%',
          height: '50vh',
        }}
      />
      <h1 className="index-title">Cerebral</h1>
      <div className="docs-doc">
        <div className="docs-doc-content">
          {
            props.compile(`
> A declarative **state and side effects management** solution for popular JavaScript frameworks
`).tree
          }
          <div className="index-buttons">
            <a href="/docs/introduction" className="button">
              introduction
            </a>
            <a href="/docs/api" className="button">
              api
            </a>
          </div>
          <div className="index-example-row">
            <div>
              {
                props.compile(`
Writing **declaratively**:

\`\`\`js
<h1 class="header">Hello</h1>
\`\`\`
`).tree
              }
            </div>
            <div>
              {
                props.compile(`
Compared to **imperatively**:

\`\`\`js
const h1 = document.createElement('h1')
h1.className = 'header'
document.body.appendChild(h1)
\`\`\`
`).tree
              }
            </div>
          </div>
          {
            props.compile(`
It makes perfect sense for us to write our UIs in a declarative manner. The reason is that we need to reuse UI elements and compose them together in different configurations. One can also claim that declarative code reads better, not because it is less syntax, but because you only describe **what** you want, not **how** you want it.

But what about our business logic, can we get the same benefits there?

`).tree
          }
          <div className="index-example-row">
            <div>
              {
                props.compile(`
Writing **declaratively**:

\`\`\`js
[
  set(state\`isLoadingUser\`, true),
  httpGet('/user'), {
    success: set(state\`user\`, props\`user\`),
    error: set(state\`error\`, props\`error\`)
  },
  set(state\`isLoadingUser\`, false),
]
\`\`\`
        `).tree
              }
            </div>
            <div>
              {
                props.compile(`
Compared to **imperatively**:

\`\`\`js
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
\`\`\`
        `).tree
              }
            </div>
          </div>
          {
            props.compile(`
You might think this example tries to highlight "less lines of code", but that is just a result of reaching for the following properties:

- **Composability**
- **Readability**
- **Reusability**
- **Testability**

All these properties makes **better code** and the declarative approach inherits all of them by default, where the imperative approach does not. **Read on to learn more about how Cerebral enforces these properties in your codebase**.
`).tree
          }
          <div className="index-buttons">
            <a href="/docs/introduction" className="button">
              introduction
            </a>
            <a href="/docs/api" className="button">
              api
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
