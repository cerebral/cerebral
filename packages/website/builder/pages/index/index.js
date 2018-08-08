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
\`\`\`marksy
<Views />
\`\`\`
            `).tree
          }
          <div className="index-buttons">
            <a href="/docs/introduction" className="button">
              GET STARTED
            </a>
            <a href="/docs/api" className="button">
              API
            </a>
          </div>
          {
            props.compile(
              `It makes perfect sense for us to write our UIs with declarative code. The reason is that we need to reuse UI elements and compose them together in different configurations. UIs are complex.`
            ).tree
          }
          <div className="index-example-row">
            <div>
              {
                props.compile(`
**DECLARATIVE**

\`\`\`js
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
\`\`\`
`).tree
              }
            </div>
            <div>
              {
                props.compile(`
**IMPERATIVE**

\`\`\`js
const list = document.createElement('ul')
const item1 = document.createElement('li')
const item2 = document.createElement('li')

item1.innerHTML = 'Item 1'
item2.innerHTML = 'Item 2'
list.appendChild(item1)
list.appendChild(item2)
\`\`\`
`).tree
              }
            </div>
          </div>
          {
            props.compile(`
But what about our application logic? Applications are becoming more complex in nature as we push the boundaries of user experiences. 
The code we write to manage this complexity would also benefit from having the same properties as our UI code.

`).tree
          }
          <div className="index-example-row">
            <div>
              {
                props.compile(`
**DECLARATIVE**

\`\`\`js
[
  setLoading(true),
  getUser,
  {
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
**IMPERATIVE**

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
A declarative approach to application logic also allows us to build developer tools that builds the mental image of this complexity for you:

![debugger](/images/debugger.png)

Take a look at a real project using Cerebral, [Codesandbox.io](https://www.codesandbox.io). The client  is completely open source and the [code can be explored here](https://github.com/CompuIves/codesandbox-client/tree/master/packages/app/src/app).

![codesandbox](/images/codesandbox.jpeg)
`).tree
          }
          <div className="index-buttons">
            <a href="/docs/introduction" className="button">
              GET STARTED
            </a>
            <a href="/docs/api" className="button">
              API
            </a>
          </div>
          <div className="index-release">
            Released under the MIT License
            <br />
            Copyright © {new Date().getFullYear()} Cerebral Github Organisation
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
