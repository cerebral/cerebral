import './styles.css'
import Inferno from 'inferno' // eslint-disable-line
import classNames from 'classnames'
import connector from 'connector'
import {connect} from 'cerebral/inferno'
import {state, signal} from 'cerebral/tags'
import Toolbar from '../Toolbar'
import Signals from '../Signals'
import Mutations from '../Mutations'
import Components from '../Components'
import Model from '../Model'

export default connect({
  port: state`port`,
  type: state`type`,
  error: state`error`,
  currentPage: state`debugger.currentPage`,
  executingSignalsCount: state`debugger.executingSignalsCount`,
  settings: state`debugger.settings`,
  isSmall: state`useragent.media.small`,
  mutationsError: state`debugger.mutationsError`,
  escPressed: signal`debugger.escPressed`,
  payloadReceived: signal`debugger.payloadReceived`,
  addPortErrored: signal`debugger.addPortErrored`
},
  class App extends Inferno.Component {
    componentDidMount () {
      document.body.addEventListener('keydown', (event) => {
        if (event.keyCode === 27) {
          this.props.escPressed()
        }
      })

      connector.addPort(this.props.port, (payload) => {
        if (payload instanceof Error) {
          this.props.addPortErrored({error: payload.message})
        } else {
          this.props.payloadReceived(payload)
        }
      })
    }
    renderLayout () {
      if (this.props.isSmall) {
        switch (this.props.currentPage) {
          case 'signals':
            return (
              <div className='app-content'>
                <Signals />
              </div>
            )
          case 'components':
            return (
              <div className='app-content'>
                <Components />
              </div>
            )
          case 'mutations':
            return (
              <div className='app-content'>
                <Mutations />
              </div>
            )
          case 'model':
            return (
              <div className='app-content'>
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
              <div className='app-content'>
                <Signals />
              </div>
            )
          case 'components':
            return (
              <div className='app-content'>
                <Components />
              </div>
            )
          case 'mutations':
            return (
              <div className='app-content'>
                <Mutations />
              </div>
            )
          case 'model':
            return (
              <div className='app-content'>
                {this.props.type === 'c' || this.props.type === 'cft' ? <Model /> : null}
              </div>
            )
          default:
            return null
        }
      }
    }
    renderError () {
      return (
        <div className='error'>
          <div className='error-title'>warning</div>
          {this.props.error}
        </div>
      )
    }
    render () {
      const mutationsError = this.props.mutationsError

      return (
        <div className='debugger'>
          {
            mutationsError
            ? <div className='app-mutationsError'>
              <h1>Ops!</h1>
              <h4>Signal "{mutationsError.signalName}" causes an error doing <strong>{mutationsError.mutation.name}</strong>("{mutationsError.mutation.path.join('.')}", {JSON.stringify(mutationsError.mutation.args).replace(/^\[/, '').replace(/]$/, '')})</h4>
            </div>
            : <div className='app-toolbar'>
              <Toolbar />
            </div>
          }
          {this.props.error ? this.renderError() : this.renderLayout()}
          <div className='execution'>
            {this.props.executingSignalsCount ? 'executing' : 'idle'}
            <div className={classNames('execution-led', {
              'execution-led--idle': !this.props.executingSignalsCount,
              'execution-led--executing': !!this.props.executingSignalsCount
            })} />
          </div>
        </div>
      )
    }
  }
)
