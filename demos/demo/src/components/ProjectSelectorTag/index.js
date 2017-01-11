import React from 'react'
import {connect} from 'cerebral/react'
import {props, signal, state} from 'cerebral/tags'
import ProjectSelector from '../ProjectSelector'

export default connect(
  {
    item: state`projects.all.${props`itemKey`}.**`,
    onClick: signal`projects.projectTagClicked`,
    showSelector: state`projects.$showProjectSelector`
  },
  function ProjectTag ({item, onClick, showSelector}) {
    if (!item) {
      return null
    }
    return (
      <div className='control Selector'>
        <span className='tag is-primary' onClick={() => onClick()}>
          {item.name}
        </span>
        {showSelector && <ProjectSelector />}
      </div>
    )
  }
)
