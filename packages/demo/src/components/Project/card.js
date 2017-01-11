import React from 'react'
import {connect} from 'cerebral/react'
import {signal} from 'cerebral/tags'
import projectWithDetails from '../../computed/projectWithDetails'
import {displayElapsed} from '../../helpers/dateTime'

export default connect(
  ({itemKey}) => ({
    item: projectWithDetails.props({itemKey})
  }),
  {
    penClick: signal`projects.penClicked`,
    trashClick: signal`projects.trashClicked`
  },
  function ProjectCard ({item, itemKey, penClick, trashClick}) {
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
              <p className='subtitle is-6'>{item.client && item.client.name}</p>
            </div>
            <div className='media-right'>
              {displayElapsed(item.elapsed)}
            </div>
          </div>

          <div className='content'>
            {item.notes}
          </div>

          <nav className='level' onClick={e => e.stopPropagation()}>
            <div className='level-left' />
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
        </div>
      </div>
    )
  }
)
