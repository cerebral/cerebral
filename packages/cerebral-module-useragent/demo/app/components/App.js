import React from 'react'
import {HOC as Cerebral} from 'cerebral-view-react'

function App (props) {
  const { useragent } = props

  const containerStyle = {
    display: 'flex',
    flexFlow: 'row wrap'
  }

  const sectionStyle = {
    whiteSpace: 'pre',
    background: 'lightgrey',
    margin: 10,
    padding: 5
  }

  const codeStyle = {
    whiteSpace: 'pre'
  }

  return (
    <div style={ containerStyle }>
      <section style={ sectionStyle }>
        <h1>useragent.browser</h1>
        <code style={ codeStyle }>{ JSON.stringify(useragent.browser, null, 2) }</code>
      </section>
      <section style={ sectionStyle }>
        <h1>useragent.device</h1>
        <code style={ codeStyle }>{ JSON.stringify(useragent.device, null, 2) }</code>
      </section>
      <section style={ sectionStyle }>
        <h1>useragent.media</h1>
        <code style={ codeStyle }>{ JSON.stringify(useragent.media, null, 2) }</code>
      </section>
      <section style={ sectionStyle }>
        <h1>useragent.os</h1>
        <code style={ codeStyle }>{ JSON.stringify(useragent.os, null, 2) }</code>
      </section>
      <section style={ sectionStyle }>
        <h1>useragent.window</h1>
        <code style={ codeStyle }>{ JSON.stringify(useragent.window, null, 2) }</code>
      </section>
      <section style={ sectionStyle }>
        <h1>useragent.feature</h1>
        <code style={ codeStyle }>{ JSON.stringify(useragent.feature, null, 2) }</code>
      </section>
    </div>
  )
}

export default Cerebral(App, {
  useragent: ['useragent']
})
