import Controller from './Controller'

class UniversalController extends Controller {
  constructor (controllerOptions) {
    super(controllerOptions)
    this.changes = []
    this.initialModel = JSON.stringify(this.model.state)
    this.trackChanges = this.trackChanges.bind(this)
    this.on('flush', this.trackChanges)
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
    this.model.state = JSON.parse(this.initialModel)
    this.changes = []
    return super.run('UniversalController.run', sequence, payload)
  }
}

export default UniversalController
