import React from 'react'
import {connect} from 'cerebral/react'
import visibleClientKeys from '../../computed/visibleClientKeys'
import translations from '../../computed/translations'

import Client from '../Client'

export default connect(
  {
    clientKeys: visibleClientKeys,
    filter: 'clients.$filter',
    selectedKey: 'clients.$draft.key',
    t: translations
  },
  {
    enterPressed: 'clients.filterEnterPressed',
    onChange: 'clients.filterChanged',
    onClick: 'clients.addClicked'
  },
  function Clients ({clientKeys, filter, selectedKey, t, enterPressed, onChange, onClick}) {
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
          {clientKeys.map(key => (
            <div key={key} className='column'>
              <Client itemKey={key} isSelected={key === selectedKey} />
            </div>
          ))}
        </div>
      </div>
    )
  }
)
