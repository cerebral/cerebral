import './styles.css'
import React from 'react'
import classNames from 'classnames'
import {connect} from 'cerebral/react'

import Inspector from '../Inspector'

export default connect({
  currentPage: 'debugger.currentPage',
  useragent: 'useragent.**',
  model: 'debugger.model.**',
  path: 'debugger.currentMutationPath'
}, {
  modelChanged: 'debugger.modelChanged',
  modelClicked: 'debugger.modelClicked'
},
  class Model extends React.Component {
    render () {
      return (
        <div className={classNames('model-wrapper', this.props.className)}>
          <div className='model' onClick={() => this.props.modelClicked()}>
            <Inspector
              value={this.props.model}
              expanded
              canEdit
              path={this.props.path}
              modelChanged={this.props.modelChanged}
            />
          </div>
        </div>
      )
    }
  }
)
