const React = require('react')
const Prism = require('prismjs')
const prismJsx = require('./prismJsx')
const prismJsxTs = require('./prismJsxTs')
const marksy = require('marksy/components').marksy

prismJsx(Prism)
prismJsxTs(Prism)

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
            frameBorder="0"
            allowFullScreen
          />
        </div>
      )
    },
  },
  elements: {
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
    h1(props) {
      return (
        <h1 id={props.id}>
          {props.children}
        </h1>
      )
    },
    h2(props) {
      return (
        <h2 id={props.id}>
          {props.children}
          <a href={`#${props.id}`}>∞</a>
        </h2>
      )
    },
    h3(props) {
      return (
        <h3 id={props.id}>
          {props.children}
          <a href={`#${props.id}`}>∞</a>
        </h3>
      )
    },
    h4(props) {
      return (
        <h4 id={props.id}>
          {props.children}
          <a href={`#${props.id}`}>∞</a>
        </h4>
      )
    },
    h5(props) {
      return (
        <h5 id={props.id}>
          {props.children}
          <a href={`#${props.id}`}>∞</a>
        </h5>
      )
    },
    h6(props) {
      return (
        <h6 id={props.id}>
          {props.children}
          <a href={`#${props.id}`}>∞</a>
        </h6>
      )
    },
  },
})
