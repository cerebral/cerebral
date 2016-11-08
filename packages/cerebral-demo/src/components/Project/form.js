import React from 'react'
import {connect} from 'cerebral/react'
import translations from '../../computed/translations'

import Input from './Input'
import Select from './Select'
import Textarea from '../Textarea'

export default connect(
  {
    clients: 'clients.all.**',
    project: `projects.$draft.**`,
    t: translations
  },
  {
    discardClick: 'projects.cancelClicked',
    saveClick: 'projects.saveClicked'
  },
  function ProjectForm ({clients, project, t, discardClick, saveClick}) {
    const client = clients[project.clientRef]
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
              <p className='subtitle is-6'>{client.name}</p>
            </div>
          </div>

          <nav className='level'>
            <div className='level-left' />
            <div className='level-right'>
              <div className='level-item'>
                <p className='control'>
                  <a className='button' onClick={() => discardClick()}>
                    {t.Discard}
                  </a>
                </p>
              </div>
              <div className='level-item'>
                <p className='control'>
                  <a className='button is-primary' onClick={() => saveClick()}>
                    {t.Save}
                  </a>
                </p>
              </div>
            </div>
          </nav>

          <div className='content'>
            <p className='control'>
              <Input field='name' autoFocus placeholderKey='ProjectName' />
            </p>
            <p className='control'>
              <Select field='clientRef' />
            </p>
            <p className='control'>
              <Textarea field='notes' placeholderKey='Notes' />
            </p>
          </div>
        </div>
      </div>
    )
  }
)
