import React from 'react'
import {connect} from 'cerebral/react'
import visibleClientRefs from '../../computed/visibleClientRefs'
import translations from '../../computed/translations'

import Client from '../Client'
import SaveDraftModal from './SaveDraftModal'

export default connect(
  {
    clientRefs: visibleClientRefs,
    filter: 'clients.$filter',
    t: translations
  },
  {
    enterPressed: 'clients.filterEnterPressed',
    onChange: 'clients.filterChanged',
    onClick: 'clients.addClicked'
  },
  function Clients ({clientRefs, filter, t, enterPressed, onChange, onClick}) {
    const onKeyPress = e => {
      switch (e.key) {
        case 'Enter': enterPressed(); break
        default: break // noop
      }
    }

    return (
      <div>
        <SaveDraftModal />
        <div className='level'>
          <div className='level-left'>
            <div className='level-item'>
              <p className='control has-addons'>
                <input className='input'
                  placeholder={t.ClientNameFilter}
                  value={filter || ''}
                  onChange={e => onChange({filter: e.target.value})}
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
          {clientRefs.map(ref => (
            <div key={ref} className='column'>
              <Client clientRef={ref} />
            </div>
          ))}
        </div>
      </div>
    )
  }
)
