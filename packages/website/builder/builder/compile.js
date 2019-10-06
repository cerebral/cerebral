const React = require('react')
const Prism = require('prismjs')
const prismJsx = require('./prismJsx')
const prismJsxTs = require('./prismJsxTs')
const marksy = require('marksy/components').marksy

prismJsx(Prism)
prismJsxTs(Prism)

const compile = marksy({
  createElement: React.createElement,
  highlight(language, code) {
    return Prism.highlight(code, Prism.languages[language])
  },
  components: {
    Views() {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            margin: '0 50px 50px 50px',
          }}
        >
          <div
            style={{
              backgroundImage: 'url(/images/vuejs.png)',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              width: '5vw',
              height: '5vw',
            }}
          />
          <div
            style={{
              backgroundImage: 'url(/images/react.png)',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              width: '5vw',
              height: '5vw',
            }}
          />
          <div
            style={{
              backgroundImage: 'url(/images/angular.png)',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              width: '5vw',
              height: '5vw',
            }}
          />
          <div
            style={{
              backgroundImage: 'url(/images/preact.jpg)',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              width: '5vw',
              height: '5vw',
            }}
          />
          <div
            style={{
              backgroundImage: 'url(/images/inferno.png)',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              width: '5vw',
              height: '5vw',
            }}
          />
        </div>
      )
    },
    Image(props) {
      return <img src={props.src} style={props.style} />
    },
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
    Codesandbox(props) {
      return (
        <iframe
          src={`https://codesandbox.io/embed/${props.id}?fontsize=14`}
          title="cerebral-todomvc"
          allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
          style={{
            width: '100%',
            height: 500,
            border: 0,
            borderRadius: 4,
            overflow: 'hidden',
          }}
          sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
        />
      )
    },
    Warning(props) {
      return (
        <div
          style={{
            backgroundColor: '#FAFAFA',
            borderLeft: '4px solid #f44336',
            borderRadius: '3px',
            padding: '10px 15px',
            color: '#666',
          }}
        >
          {compile(props.children.join('')).tree}
        </div>
      )
    },
    Info(props) {
      return (
        <div
          style={{
            backgroundColor: '#FAFAFA',
            borderLeft: '4px solid #f4ca36',
            borderRadius: '3px',
            padding: '10px 15px',
            color: '#666',
          }}
        >
          {compile(props.children.join('')).tree}
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
      return <h1 id={props.id}>{props.children}</h1>
    },
    h2(props) {
      return (
        <h2>
          {props.children}
          <a href={`#${props.id}`}>∞</a>
          <span id={props.id}>&nbsp;</span>
        </h2>
      )
    },
    h3(props) {
      return (
        <h3>
          {props.children}
          <a href={`#${props.id}`}>∞</a>
          <span id={props.id}>&nbsp;</span>
        </h3>
      )
    },
    h4(props) {
      return (
        <h4>
          {props.children}
          <a href={`#${props.id}`}>∞</a>
          <span id={props.id}>&nbsp;</span>
        </h4>
      )
    },
    h5(props) {
      return (
        <h5>
          {props.children}
          <a href={`#${props.id}`}>∞</a>
          <span id={props.id}>&nbsp;</span>
        </h5>
      )
    },
    h6(props) {
      return (
        <h6>
          {props.children}
          <a href={`#${props.id}`}>∞</a>
          <span id={props.id}>&nbsp;</span>
        </h6>
      )
    },
  },
})

module.exports = compile
