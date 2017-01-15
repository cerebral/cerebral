import React from 'react'
import {connect} from 'cerebral/react'
import {signal, state} from 'cerebral/tags'
import translations from '../../common/computed/translations'

import Input from './Input'
import Select from './Select'
import Textarea from '../Textarea'

export default connect(
  {
    clients: state`clients.all.**`,
    discardClick: signal`projects.discardClicked`,
    item: state`projects.$draft.**`,
    saveClick: signal`projects.saveClicked`,
    t: translations
  },
  function ProjectForm ({clients, discardClick, item, saveClick, t}) {
    const client = clients[item.clientKey] || clients['no-client']
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
                {item.name}
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
              <Select field='clientKey' />
            </p>
            <p className='control'>
              <Textarea field='notes'
                moduleName='projects'
                placeholderKey='Notes' />
            </p>
          </div>
        </div>
      </div>
    )
  }
)
