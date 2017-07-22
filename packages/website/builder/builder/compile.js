const React = require('react')
const Prism = require('prismjs')
const prismJsx = require('./prismJsx')
const marksy = require('marksy/components').marksy

prismJsx(Prism)

module.exports = marksy({
  createElement: React.createElement,
  highlight(language, code) {
    return Prism.highlight(code, Prism.languages[language])
  },
  components: {
    Youtube(props) {
      return (
        <div style={{ textAlign: 'center' }}>
          <iframe
            style={{ border: '1px solid #333' }}
            width="560"
            height="315"
            src={props.url}
            frameborder="0"
            allowfullscreen
          />
        </div>
      )
    },
  },
  a(props) {
    return (
      <a
        href={props.href}
        target={props.href.substr(0, 4) === 'http' ? 'new' : null}
      >
        {props.children}
      </a>
    )
  },
})
