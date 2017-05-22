import Controller from './Controller'
import {throwError} from './utils'

class UniversalController extends Controller {
  constructor (controllerOptions) {
    super(controllerOptions)
    this.changes = []
    this.model.state = JSON.parse(JSON.stringify(this.model.state))
    this.trackChanges = this.trackChanges.bind(this)
    this.on('flush', this.trackChanges)
    this.hasRun = false
  }
  trackChanges (changes) {
    this.changes = this.changes.concat(changes)
  }
  getScript () {
    const state = JSON.stringify(this.changes.reduce((changes, change) => {
      changes[change.path.join('.')] = this.getState(change.path)

      return changes
    }, {}))

    return `<script>window.CEREBRAL_STATE = ${state}</script>`
  }
  run (sequence, payload) {
    if (this.hasRun) {
      throwError('You can not run the universal controller more than once, create a new one')
    }
    this.hasRun = true

    return super.run('UniversalController.run', sequence, payload)
  }
}

export default UniversalController
