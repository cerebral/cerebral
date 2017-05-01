import './styles.css'
import Inferno from 'inferno' // eslint-disable-line
import {connect} from 'cerebral/inferno'
import {state} from 'cerebral/tags'
import StatePaths from './StatePaths'
import Renders from './Renders'

export default connect({
  map: state`debugger.componentsMap`,
  renders: state`debugger.renders`,
  searchValue: state`debugger.searchValue`
},
  function Components (props) {
    return (
      <div className='components-wrapper'>
        <StatePaths map={props.map} filter={props.searchValue} />
        <Renders renders={props.renders} filter={props.searchValue} />
      </div>
    )
  }
)
