import React from 'react'
import {connect} from 'cerebral/react'
import translations from '../../computed/translations'

export default connect(
  {
    t: translations
  },
  function Login ({t}) {
    return (
      <div className='modal is-active'>
        <div className='modal-background' />
        <div className='modal-content'>
          <div className='box'>
            <h2 className='title'>{t.pleaseLogin}</h2>
            <p className='control has-icon'>
              <input className='input' type='text'
                autoFocus
                placeholder={t.loginUserPlaceholder}
                value={''}
                name='login'
                />
              <i className='fa fa-user' />
            </p>
            <p className='control has-icon'>
              <input className='input' type='password'
                placeholder={t.loginPasswordPlaceholder}
                value={''}
                name='password'
                />
              <i className='fa fa-key' />
            </p>
          </div>
        </div>
      </div>
    )
  }
)
