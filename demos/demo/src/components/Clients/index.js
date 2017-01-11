import React from 'react'
import {connect} from 'cerebral/react'
import listProps from '../../common/Collection/props/list'
import translations from '../../common/computed/translations'

import Client from '../Client'

export default connect(
  listProps('clients', {t: translations}),
  function Clients ({enterPressed, filter, onChange, onClick, selectedKey, t, visibleKeys}) {
    const onKeyPress = e => {
      switch (e.key) {
        case 'Enter': enterPressed(); break
        default: break // noop
      }
    }

    return (
      <div>
        <div className='level'>
          <div className='level-left'>
            <div className='level-item'>
              <p className='control has-addons'>
                <input className='input'
                  placeholder={t.ClientNameFilter}
                  value={filter || ''}
                  onChange={e => onChange({value: e.target.value})}
                  onKeyPress={onKeyPress}
                  />
                <button className='button is-primary'
                  onClick={() => onClick()}>
                  {t.Add}
                </button>
              </p>
            </div>
          </div>
        </div>
        <div className='columns is-multiline'>
          {visibleKeys.map(key => (
            <div key={key} className='column'>
              <Client itemKey={key} isSelected={key === selectedKey} />
            </div>
          ))}
        </div>
      </div>
    )
  }
)
