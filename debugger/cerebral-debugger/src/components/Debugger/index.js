import './styles.css'
import Inferno from 'inferno'
import {connect} from 'cerebral/inferno'
import {state, signal} from 'cerebral/tags'
import Toolbar from './Toolbar'
import Signals from './Signals'
import Mutations from './Mutations'
import Components from './Components'
import Model from './Model'

export default connect({
  currentPage: state`debugger.currentPage`,
  settings: state`debugger.settings`,
  isSmall: state`useragent.media.small`,
  mutationsError: state`debugger.mutationsError`,
  isCatchingUp: state`debugger.isCatchingUp`,
  escPressed: signal`debugger.escPressed`
},
  class Debugger extends Inferno.Component {
    componentDidMount () {
      document.body.addEventListener('keydown', (event) => {
        if (event.keyCode === 27) {
          this.props.escPressed()
        }
      })
    }
    renderLayout () {
      if (this.props.isSmall) {
        switch (this.props.currentPage) {
          case 'signals':
            return (
              <div className='debugger-content'>
                <Signals />
              </div>
            )
          case 'components':
            return (
              <div className='debugger-content'>
                <Components />
              </div>
            )
          case 'timeTravel':
            return (
              <div className='debugger-content'>
                <Mutations />
              </div>
            )
          case 'model':
            return (
              <div className='debugger-content'>
                <Model />
              </div>
            )
          default:
            return null
        }
      } else {
        switch (this.props.currentPage) {
          case 'signals':
            return (
              <div className='debugger-content'>
                <Signals />
                <Model />
              </div>
            )
          case 'components':
            return (
              <div className='debugger-content'>
                <Components />
              </div>
            )
          case 'mutations':
            return (
              <div className='debugger-content'>
                <Mutations />
                <Model />
              </div>
            )
          case 'model':
            return (
              <div className='debugger-content'>
                <Signals />
                <Model />
              </div>
            )
          default:
            return null
        }
      }
    }
    render () {
      if (this.props.isCatchingUp) {
        return (
          <div className='debugger'>
            <div className='debugger-toolbar'>
              <Toolbar />
            </div>
            <div className='debugger-disabled'>
              <img src='logo.png' width='200' role='presentation' />
              <h1>Loading...</h1>
              <h3>Catching up with app state</h3>
            </div>
          </div>
        )
      }

      if (this.props.settings.disableDebugger) {
        return (
          <div className='debugger'>
            <div className='debugger-toolbar'>
              <Toolbar />
            </div>
            <div className='debugger-disabled'>
              <img src='logo.png' width='200' role='presentation' />
              <h1>Disabled</h1>
              <h3>Enable debugger and refresh</h3>
            </div>
          </div>
        )
      }
      const mutationsError = this.props.mutationsError

      return (
        <div className='debugger'>
          {
            mutationsError
            ? <div className='debugger-mutationsError'>
              <h1>Ops!</h1>
              <h4>Signal "{mutationsError.signalName}" causes an error doing <strong>{mutationsError.mutation.name}</strong>("{mutationsError.mutation.path.join('.')}", {JSON.stringify(mutationsError.mutation.args).replace(/^\[/, '').replace(/]$/, '')})</h4>
            </div>
            : <div className='debugger-toolbar'>
              <Toolbar />
            </div>
          }
          {this.renderLayout()}
        </div>
      )
    }
  }
)
