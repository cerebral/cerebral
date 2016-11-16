import React from 'react'
import {connect} from 'cerebral/react'

import ClientForm from './form'
import Email from '../Email'
import Phone from '../Phone'

export default connect(
  ({clientRef}) => ({
    client: `clients.all.${clientRef}`,
    selectedClient: 'clients.$draft.**'
  }),
  {
    penClick: 'clients.penClicked',
    trashClick: 'clients.trashClicked'
  },
  function Client ({client, selectedClient, penClick, trashClick}) {
    if (selectedClient && selectedClient.ref === client.ref) {
      return <ClientForm clientRef={client.ref} />
    }

    return (
      <div className='card'>
        <div className='card-content'>
          <div className='media'>
            <div className='media-left'>
              <figure className='image is-32x32'>
                <img src={`/img/${client.image}` || '/img/client-mini.png'} alt='user' />
              </figure>
            </div>
            <div className='media-content'>
              <p className='title is-5'>{client.name}</p>
              {client.website &&
                <p className='subtitle is-6'>
                  <a href={`http://${client.website}`}>{client.website}</a>
                </p>
              }
            </div>
          </div>

          <nav className='level'>
            <div className='level-left'>
              <Phone phone={client.phone} />
              <Email email={client.email} />
            </div>
            <div className='level-right'>
              {client.$isDefaultItem !== true && (
                <a className='level-item' onClick={() => penClick({ref: client.ref})}>
                  <span className='icon is-small'><i className='fa fa-pencil' /></span>
                </a>
              )}
              {client.$isDefaultItem !== true && (
                <a className='level-item' onClick={() => trashClick({ref: client.ref})}>
                  <span className='icon is-small'><i className='fa fa-trash' /></span>
                </a>
              )}
            </div>
          </nav>

          {client.notes && <div className='content'>{client.notes}</div>}
        </div>
      </div>
    )
  }
)
