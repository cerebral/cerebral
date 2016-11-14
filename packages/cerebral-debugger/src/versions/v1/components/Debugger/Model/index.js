import React from 'react'
import classNames from 'classnames'
import {connect} from 'cerebral/react'
import styles from './styles.css'

import Inspector from '../Inspector'

export default connect({
  currentPage: 'debugger.currentPage',
  media: 'useragent.media',
  model: 'debugger.model',
  path: 'debugger.currentMutationPath'
}, {
  modelChanged: 'debugger.modelChanged',
  modelClicked: 'debugger.modelClicked'
},
  class Model extends React.Component {
    shouldComponentUpdate (nextProps) {
      return (
        this.props.currentPage !== nextProps.currentPage ||
        this.props.media.small !== nextProps.media.small ||
        this.props.path !== nextProps.path ||
        this.props.model !== nextProps.model
      )
    }
    render () {
      return (
        <div className={classNames(styles.wrapper, this.props.className)}>
          <div className={styles.model} onClick={() => this.props.modelClicked()}>
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
