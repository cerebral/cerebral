import './styles.css'
import Inferno from 'inferno'
import jsonStorage from 'electron-json-storage'
import connector from 'connector'
import {Controller} from 'cerebral'
import {Container} from 'cerebral/inferno'
import UserAgent from '@cerebral/useragent'
import DebuggerModule from '../../modules/Debugger'
import NewVersion from './NewVersion'

import AddApp from './AddApp'
import App from './App'
import Apps from './Apps'

class Debugger extends Inferno.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      apps: {},
      currentApp: null,
      showAddApp: false,
      error: null,
      versionChange: null
    }
    this.addPort = this.addPort.bind(this)
    this.addNewPort = this.addNewPort.bind(this)
    this.cancelAddNewPort = this.cancelAddNewPort.bind(this)
    this.changePort = this.changePort.bind(this)
    this.removePort = this.removePort.bind(this)
    this.giveReminder = this.giveReminder.bind(this)
    this.ignoreReminder = this.ignoreReminder.bind(this)
  }
  componentDidMount () {
    window.onerror = (error, mip, mop, stack) => {
      this.setState({error})
    }

    Promise.all([
      new Promise((resolve, reject) => {
        jsonStorage.get('apps', (err, storedApps) => {
          if (err) {
            reject(err)
          } else {
            resolve(storedApps)
          }
        })
      }),
      new Promise((resolve, reject) => {
        jsonStorage.get('currentPort', (err, currentPort) => {
          if (err) {
            reject(err)
          } else {
            resolve(typeof currentPort === 'string' ? currentPort : null)
          }
        })
      }),
      new Promise((resolve, reject) => {
        jsonStorage.get('ignoreVersion', (err, ignoreVersion) => {
          if (err) {
            reject(err)
          } else {
            resolve(typeof ignoreVersion === 'string' ? ignoreVersion : null)
          }
        })
      })
    ])
      .then((results) => {
        const storedApps = results[0]
        const currentPort = results[1]
        const ports = Object.keys(storedApps)

        this.setState({
          apps: ports.reduce((apps, port) => {
            apps[port] = Object.assign(storedApps[port], {
              controller: Controller({
                state: {
                  port,
                  type: storedApps[port].type,
                  error: null
                },
                modules: {
                  debugger: DebuggerModule(),
                  useragent: UserAgent({
                    media: {
                      small: '(max-width: 1270px)'
                    }
                  })
                }
              })
            })

            return apps
          }, {}),
          currentPort: currentPort || ports[0] || null,
          isLoading: false
        })

        connector.checkVersion((version) => {
          if (version && version.current !== version.new && results[2] !== version.new) {
            this.setState({
              versionChange: version
            })
          }
        })
      })

    connector.onPortFocus((port) => {
      this.setState({
        currentPort: port
      })
    })
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.currentPort !== prevState.currentPort) {
      jsonStorage.set('currentPort', this.state.currentPort)
    }
  }
  giveReminder () {
    this.setState({
      versionChange: null
    })
  }
  ignoreReminder () {
    jsonStorage.set('ignoreVersion', this.state.versionChange.new)
    this.setState({
      versionChange: null
    })
  }
  addPort (type, name, port) {
    if (this.state.apps[port]) {
      return false
    }

    const apps = Object.assign(this.state.apps, {
      [port]: {
        name,
        type,
        controller: Controller({
          state: {
            port,
            type
          },
          modules: {
            debugger: DebuggerModule,
            useragent: UserAgent({
              media: {
                small: '(max-width: 1270px)'
              }
            })
          }
        })
      }
    })

    this.setState({
      apps,
      currentPort: port,
      showAddApp: false
    })

    this.storeCurrentApps(apps)
  }
  storeCurrentApps (apps) {
    jsonStorage.set('apps', Object.keys(apps).reduce((appsToStore, port) => {
      appsToStore[port] = {
        name: apps[port].name,
        type: apps[port].type
      }

      return appsToStore
    }, {}))
  }
  addNewPort () {
    this.setState({
      showAddApp: true
    })
  }
  cancelAddNewPort () {
    this.setState({
      showAddApp: false
    })
  }
  changePort (port) {
    this.setState({
      currentPort: port
    })
  }
  removePort (portToRemove) {
    const newApps = Object.keys(this.state.apps)
      .filter((port) => port !== portToRemove)
      .reduce((apps, remainingPort) => {
        apps[remainingPort] = this.state.apps[remainingPort]

        return apps
      }, {})

    this.setState({
      apps: newApps,
      currentPort: portToRemove === this.state.currentPort ? Object.keys(newApps)[0] : this.state.currentPort
    })

    connector.removePort(portToRemove)
    this.storeCurrentApps(newApps)
  }
  render () {
    if (this.state.error) {
      return (
        <div class='error'>
          <h1>Ops, something bad happened :(</h1>
          <h4>{this.state.error}</h4>
          <button onClick={() => window.location.reload()}>restart debugger</button>
        </div>
      )
    }

    if (this.state.isLoading) {
      return null
    }

    if (this.state.showAddApp || !Object.keys(this.state.apps).length) {
      return (
        <AddApp
          portsCount={Object.keys(this.state.apps).length}
          addPort={this.addPort}
          cancelAddNewPort={this.cancelAddNewPort}
        />
      )
    }

    const currentApp = this.state.currentPort ? this.state.apps[this.state.currentPort] : null

    return (
      <div>
        <Apps
          apps={this.state.apps}
          currentPort={this.state.currentPort}
          addNewPort={this.addNewPort}
          cancelAddNewPort={this.cancelAddNewPort}
          changePort={this.changePort}
          removePort={this.removePort}
        />
        <Container key={this.state.currentPort} controller={currentApp.controller} style={{height: '100%'}}>
          <App key={this.state.currentPort} />
        </Container>
        {this.state.versionChange ? (
          <NewVersion giveReminder={this.giveReminder} ignoreReminder={this.ignoreReminder} versionChange={this.state.versionChange} />
        ) : null}
      </div>
    )
  }
}

export default Debugger
