import React from 'react'
import {connect} from 'cerebral/react'
import translations from '../../computed/translations'

export default connect(
  {
    showModal: 'clients.$showSaveDraftModal',
    t: translations
  },
  {
    discardClick: 'clients.discardClicked',
    reviewClick: 'clients.reviewChangesClicked',
    saveClick: 'clients.saveClicked'
  },
  function ClientSaveDraftModal ({showModal, t, discardClick, reviewClick, saveClick}) {
    if (!showModal) {
      return null
    }
    return (
      <div className='modal is-active'>
        <div className='modal-background' />
        <div className='modal-content'>
          <div className='box'>
            <h3 className='subtitle'>{t.UnsavedClientChanges}</h3>
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
                    <a className='button' onClick={() => reviewClick()}>
                      {t.Review}
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
          </div>
        </div>
      </div>
    )
  }
)
