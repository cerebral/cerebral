import React from 'react'
import {connect} from 'cerebral/react'
import {signal, state} from 'cerebral/tags'
import visibleProjectsByClient from '../../computed/visibleProjectsByClient'

export default connect(
  {
    editedTask: state`tasks.$draft`,
    filter: state`projects.$filter`,
    onBackgroundClick: signal`projects.selectorBackgroundClick`,
    onChange: signal`projects.filterChanged`,
    onProjectClick: signal`projects.selectorProjectClicked`,
    projectsByClient: visibleProjectsByClient
  },
  function ProjectSelector ({editedTask, filter, onBackgroundClick, onChange, onProjectClick, projectsByClient}) {
    const selectedProject = editedTask && editedTask.projectKey
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
                onChange={e => onChange({value: e.target.value})}
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
                          onClick={() => onProjectClick({key: 'projectKey', value: project.key})}>
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
