import React from 'react'
import {css} from 'aphrodite'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'
import styles from './styles'

export default connect({
  currentView: state`app.currentView`
},
  function MenuItem ({currentView, type}) {
    const innerContainer = css(
      styles.innerContainer,
      currentView === type.name ? styles.selected : null
    )
    return (
      <a href={type.url} className={css(styles.container)}>
        <div className={innerContainer}>{type.name}</div>
      </a>
    )
  }
)
