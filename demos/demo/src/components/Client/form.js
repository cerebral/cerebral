import React from 'react'
import {connect} from 'cerebral/react'
import {signal, state} from 'cerebral/tags'
import translations from '../../common/computed/translations'

import Input from './Input'
import Header from './Header'
import Textarea from '../Textarea'

export default connect(
  {
    item: state`clients.$draft.**`,
    discardClick: signal`clients.discardClicked`,
    saveClick: signal`clients.saveClicked`,
    t: translations
  },
  function ClientForm ({item, discardClick, saveClick, t}) {
    return (
      <div className='card'>
        <div className='card-content'>
          <Header item={item} />

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
            <Input field='name' autoFocus placeholderKey='CompanyName' />
            <Input field='image' type='file' icon='image' placeholderKey='ImageUrl' />
            <Input field='website' icon='globe' placeholderKey='WebsiteUrl' />
            <Input field='email' icon='envelope' placeholderKey='Email' />
            <Input field='phone' icon='phone' placeholderKey='Telephone' />
            <p className='control'>
              <Textarea field='notes'
                moduleName='clients'
                placeholderKey='Notes' />
            </p>
          </div>
        </div>
      </div>
    )
  }
)
