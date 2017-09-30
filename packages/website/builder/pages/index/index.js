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
          height: '25vh',
        }}
      />
      <h1 className="index-title">Cerebral</h1>
      <div className="docs-doc">
        <div className="docs-doc-content">
          {
            props.compile(`
> Declarative **state and side effects management** for popular JavaScript frameworks
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
          <div className="index-youtube">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/mYkM8CiVsXw"
              frameBorder="0"
              allowFullScreen
            />
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
  setLoading(true),
  getUser, {
    success: setUser,
    error: setError
  },
  setLoading(false),
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
You might think this example tries to highlight "less lines of code", but it is actually about reaching for these properties:

- **Composability**
- **Readability**
- **Reusability**
- **Testability**

All these properties makes **better code** and **scalable code**. The declarative approach inherits all of these properties by default.
You can read more about declarative code in this short blog post, [Business logic as a data structure](https://www.jsblog.io/articles/christianalfoni/business_logic_as_a_data_structure).

Declarative code also allows us to build developer tools that gives you valuable information:

![debugger](/images/debugger.gif)

Take a look at a real project using Cerebral, [WebpackBin](https://www.webpackbin.com). It is completely open source and the [code can be explored here](https://github.com/cerebral/webpackbin).

![webpackbin](/images/webpackbin.png)

> *Read on to learn more about how Cerebral enforces scalable code and gives you insight into the inner workings of your app*
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
          <div className="index-release">
            Released under the MIT License
            Copyright © 2017 Cerebral Github Organisation
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
