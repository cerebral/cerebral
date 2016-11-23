import React from 'react'
import {connect} from 'cerebral/react'
import ProjectSelector from '../ProjectSelector'
import projectFromKey from '../../computed/projectFromKey'

export default connect(
  ({itemKey}) => ({
    project: projectFromKey.props({itemKey}),
    showSelector: 'projects.$showProjectSelector'
  }),
  {
    onClick: 'projects.projectTagClicked'
  },
  function ProjectTag ({onClick, project, showSelector}) {
    return (
      <div className='control Selector'>
        <span className='tag is-primary' onClick={() => onClick()}>
          {project.name}
        </span>
        {showSelector && <ProjectSelector />}
      </div>
    )
  }
)
