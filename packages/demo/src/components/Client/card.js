import React from 'react'
import {connect} from 'cerebral/react'

import Email from '../Email'
import Phone from '../Phone'

export default connect(
  ({itemKey}) => ({
    item: `clients.all.${itemKey}`
  }),
  {
    penClick: 'clients.penClicked',
    trashClick: 'clients.trashClicked'
  },
  function Client ({item, itemKey, penClick, trashClick}) {
    return (
      <div className='card'>
        <div className='card-content'>
          <div className='media'>
            { item.image &&
              <div className='media-left'>
                <figure className='image is-32x32'>
                  <img src={`/img/${item.image}`} alt='user' />
                </figure>
              </div>
            }
            <div className='media-content'>
              <p className='title is-5'>{item.name}</p>
              {item.website &&
                <p className='subtitle is-6'>
                  <a href={`http://${item.website}`}>{item.website}</a>
                </p>
              }
            </div>
          </div>

          <nav className='level'>
            <div className='level-left'>
              <Phone phone={item.phone} />
              <Email email={item.email} />
            </div>
            <div className='level-right'>
              {item.$isDefaultItem !== true && (
                <a className='level-item' onClick={() => penClick({key: item.key})}>
                  <span className='icon is-small'><i className='fa fa-pencil' /></span>
                </a>
              )}
              {item.$isDefaultItem !== true && (
                <a className='level-item' onClick={() => trashClick({key: item.key})}>
                  <span className='icon is-small'><i className='fa fa-trash' /></span>
                </a>
              )}
            </div>
          </nav>

          {item.notes && <div className='content'>{item.notes}</div>}
        </div>
      </div>
    )
  }
)
