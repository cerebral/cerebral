import React from 'react'
import {connect} from 'cerebral/react'
import visibleProjectsByClient from '../../computed/visibleProjectsByClient'

export default connect(
  {
    filter: 'projects.$filter',
    projectsByClient: visibleProjectsByClient,
    selectedProject: 'tasks.$running.projectKey'
  },
  {
    onBackgroundClick: 'projects.selectorBackgroundClick',
    onChange: 'projects.filterChanged',
    onProjectClick: 'projects.selectorProjectClicked'
  },
  function ProjectSelector ({filter, projectsByClient, selectedProject, onBackgroundClick, onChange, onProjectClick}) {
    return (
      <div>
        <div className='SelectorBackground' onClick={() => onBackgroundClick()} />
        <div className='SelectorRight' style={{top: -4}}>
          <div className='card'>
            <header className='card-header'>
              <input className='input'
                placeholder='Find project...'
                value={filter || ''}
                autoFocus
                onChange={e => onChange({filter: e.target.value})}
                type='text' style={{border: 0, marginTop: '3px', boxShadow: 'none'}} />
            </header>
            <div className='card-content'>
              <div className='menu'>
                {projectsByClient.map(client => (
                  <div key={client.name}>
                    <p className='menu-label'>{client.name}</p>
                    <ul className='menu-list'>
                      {client.projects.map(project => (
                        <li key={project.key}
                          onClick={() => onProjectClick({ref: project.key})}>
                          &nbsp;&nbsp;
                          <span className={`tag ${project.key === selectedProject ? 'is-primary' : ''}`}>
                            {project.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
