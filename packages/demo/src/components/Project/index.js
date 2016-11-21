import React from 'react'
import {connect} from 'cerebral/react'
import projectWithDetails from '../../computed/projectWithDetails'
import {displayElapsed} from '../../helpers/dateTime'

import ProjectForm from './form'

export default connect(
  ({projectRef}) => ({
    project: projectWithDetails.props({projectRef}),
    selectedProject: 'projects.$draft'
  }),
  {
    penClick: 'projects.penClicked',
    trashClick: 'clients.trashClicked'
  },
  function project ({project, selectedProject, penClick, trashClick}) {
    if (selectedProject && selectedProject.ref === project.ref) {
      return <ProjectForm projectRef={project.ref} />
    }
    return (
      <div className='card'>
        <div className='card-content'>
          <div className='media'>
            <div className='media-left'>
              <span className='icon is-medium'>
                <i className='fa fa-folder' />
              </span>
            </div>
            <div className='media-content'>
              <p className='title is-5'>
                {project.name}
              </p>
              <p className='subtitle is-6'>{project.client && project.client.name}</p>
            </div>
            <div className='media-right'>
              {displayElapsed(project.elapsed)}
            </div>
          </div>

          <div className='content'>
            {project.notes}
          </div>

          <nav className='level' onClick={e => e.stopPropagation()}>
            <div className='level-left' />
            <div className='level-right'>
              {project.$isDefaultItem !== true && (
                <a className='level-item' onClick={() => penClick({ref: project.ref})}>
                  <span className='icon is-small'><i className='fa fa-pencil' /></span>
                </a>
              )}
              {project.$isDefaultItem !== true && (
                <a className='level-item' onClick={() => trashClick({ref: project.ref})}>
                  <span className='icon is-small'><i className='fa fa-trash' /></span>
                </a>
              )}
            </div>
          </nav>
        </div>
      </div>
    )
  }
)
