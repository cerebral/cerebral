import Inferno from 'inferno'
import {connect} from 'cerebral/inferno'
import upperCaseTitleComputed from '../../upperCaseTitle'

export default connect({
  title: upperCaseTitleComputed()
},
  function UpperTitle(props) {
    return (
      <h4>{props.title}</h4>
    )
  }
)
