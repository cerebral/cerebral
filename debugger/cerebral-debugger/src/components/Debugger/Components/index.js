import './styles.css'
import Inferno from 'inferno'
import {connect} from 'cerebral/inferno'
import {state} from 'cerebral/tags'
import StatePaths from './StatePaths'
import Renders from './Renders'

export default connect({
  map: state`debugger.componentsMap`,
  renders: state`debugger.renders`
},
  function Components (props) {
    return (
      <div className='components-wrapper'>
        <StatePaths map={props.map} />
        <Renders renders={props.renders} />
      </div>
    )
  }
)
