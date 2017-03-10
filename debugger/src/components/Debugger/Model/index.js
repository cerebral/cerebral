import './styles.css'
import Inferno from 'inferno'
import {connect} from 'cerebral/inferno'
import {state, signal} from 'cerebral/tags'
import Inspector from '../Inspector'

export default connect({
  currentPage: state`debugger.currentPage`,
  useragent: state`useragent`,
  model: state`debugger.model`,
  path: state`debugger.currentMutationPath`,
  searchValue: state`debugger.searchValue`,
  modelChanged: signal`debugger.modelChanged`,
  modelClicked: signal`debugger.modelClicked`
},
  class Model extends Inferno.Component {
    render () {
      return (
        <div className='model-wrapper'>
          <div id='model' className='model' onClick={() => this.props.modelClicked()}>
            <Inspector
              value={this.props.model}
              expanded
              canEdit
              path={this.props.searchValue ? this.props.searchValue.split('.') : this.props.path}
              modelChanged={this.props.modelChanged}
            />
          </div>
        </div>
      )
    }
  }
)
