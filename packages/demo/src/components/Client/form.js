import React from 'react'
import {connect} from 'cerebral/react'
import translations from '../../computed/translations'

import Input from './Input'
import Textarea from '../Textarea'

export default connect(
  {
    client: `clients.$draft.**`,
    t: translations
  },
  {
    discardClick: 'clients.discardClicked',
    saveClick: 'clients.saveClicked'
  },
  function ClientForm ({client, t, discardClick, saveClick}) {
    return (
      <div className='card'>
        <div className='card-content'>
          <div className='media'>
            <div className='media-left'>
              <figure className='image is-32x32'>
                <img src={client.image || '/img/client-mini.png'} alt='user' />
              </figure>
            </div>
            <div className='media-content'>
              <p className='title is-5'>
                {client.name}
              </p>
              {client.website &&
                <p className='subtitle is-6'>
                  <a href={`http://${client.website}`}>{client.website}</a>
                </p>
              }
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
            <Input field='name' autoFocus placeholderKey='CompanyName' />
            <Input field='image' icon='image' placeholderKey='ImageUrl' />
            <Input field='website' icon='globe' placeholderKey='WebsiteUrl' />
            <Input field='email' icon='envelope' placeholderKey='Email' />
            <Input field='phone' icon='phone' placeholderKey='Telephone' />
            <p className='control'>
              <Textarea field='notes' placeholderKey='Notes' />
            </p>
          </div>
        </div>
      </div>
    )
  }
)
