import React from 'react'
import {connect} from 'cerebral/react'
import ProjectSelector from '../ProjectSelector'

export default connect(
  ({itemKey}) => ({
    item: `projects.all.${itemKey}.**`,
    showSelector: 'projects.$showProjectSelector'
  }),
  {
    onClick: 'projects.projectTagClicked'
  },
  function ProjectTag ({item, showSelector, onClick}) {
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
