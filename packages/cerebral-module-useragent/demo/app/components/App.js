import React from 'react'
import {HOC as Cerebral} from 'cerebral-view-react'

function App (props) {
  const { useragent } = props

  return (
    <section>
      <h1>useragent.browser</h1>
      <code>{ JSON.stringify(useragent.browser) }</code>
      <h1>useragent.device</h1>
      <code>{ JSON.stringify(useragent.device) }</code>
      <h1>useragent.os</h1>
      <code>{ JSON.stringify(useragent.os) }</code>
      <h1>useragent.window</h1>
      <code>{ JSON.stringify(useragent.window) }</code>
    </section>
  )
}

export default Cerebral(App, {
  useragent: ['useragent']
})
