import './styles.css'
import Inferno from 'inferno' // eslint-disable-line
import {shell} from 'electron'

class AddApp extends Inferno.Component {
  constructor (props) {
    super(props)
    this.state = {
      port: '',
      name: '',
      type: 'c',
      error: null
    }
  }
  onPortChange (port) {
    this.setState({
      port,
      error: null
    })
  }
  onNameChange (name) {
    this.setState({
      name,
      error: null
    })
  }
  onTypeChange (type) {
    this.setState({
      type
    })
  }
  addPort () {
    const isAdded = this.props.addPort(this.state.type, this.state.name, this.state.port)

    if (!isAdded) {
      this.setState({
        error: 'Port in use'
      })
    }
  }
  openDocs () {
    shell.openExternal('https://cerebral.github.io/docs/get_started/debugger.html')
  }
  render () {
    return (
      <div>
        <div className='app-disabled'>
          <img src='logo.png' width='200' role='presentation' />
          <h1>add new app</h1>
          <input
            className='app-input'
            autoFocus
            placeholder='name...'
            value={this.state.name}
            onInput={(event) => this.onNameChange(event.target.value)}
          />
          <input
            className='app-input app-input-port'
            placeholder='port...'
            value={this.state.port}
            onInput={(event) => this.onPortChange(event.target.value)}
          />
          <div className='app-type-wrapper'>
            <label>
              <input
                type='radio'
                checked={this.state.type === 'c'}
                onClick={(event) => {
                  event.stopPropagation()
                  this.onTypeChange('c')
                }}
              />
              Cerebral
            </label>
            <label>
              <input
                type='radio'
                checked={this.state.type === 'ft'}
                onClick={(event) => {
                  event.stopPropagation()
                  this.onTypeChange('ft')
                }}
              />
              Function-Tree
            </label>
            <label>
              <input
                type='radio'
                checked={this.state.type === 'cft'}
                onClick={(event) => {
                  event.stopPropagation()
                  this.onTypeChange('cft')
                }}
              />
              Both
            </label>
          </div>
          <div>
            <button
              disabled={!this.state.name || !this.state.port}
              className='app-button'
              onClick={() => this.addPort()}
            >
              ADD
            </button>
            {this.props.portsCount ? (
              <button
                className='app-button'
                onClick={() => this.props.cancelAddNewPort()}
              >
                Cancel
              </button>
            ) : null}
            {!this.props.portsCount ? (
              <button
                className='app-button'
                onClick={() => this.props.addPort('c', 'tutorial', '8585')}
              >
                ADD TUTORIAL
              </button>
            ) : null}
          </div>
          {this.state.error ? (
            <div className='app-error'>
              <small><strong>error:</strong></small> {this.state.error}
            </div>
          ) : null}
          <div className='requirementsList'>
            More information can be found <a onClick={this.openDocs}>at the Cerebral website</a>
          </div>
        </div>
      </div>
    )
  }
}

export default AddApp
