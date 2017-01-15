import React from 'react'
import {connect} from 'cerebral/react'
import {props, signal, state} from 'cerebral/tags'

import Email from '../Email'
import Header from './Header'
import Phone from '../Phone'

export default connect(
  {
    item: state`clients.all.${props`itemKey`}.*`,
    penClick: signal`clients.penClicked`,
    trashClick: signal`clients.trashClicked`
  },
  function Client ({item, itemKey, penClick, trashClick}) {
    return (
      <div className='card'>
        <div className='card-content'>
          <Header item={item} />

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
