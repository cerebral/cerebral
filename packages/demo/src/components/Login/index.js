import React from 'react'
import {connect} from 'cerebral/react'
import translations from '../../computed/translations'

export default connect(
  {
    t: translations,
    $email: 'user.signIn.$email',
    $password: 'user.signIn.$password'
  },
  {
    fieldChanged: 'user.fieldChanged',
    signInClicked: 'user.signInClicked',
    createUserClicked: 'user.createUserClicked'
  },
  function Login ({t, $email, $password, fieldChanged, signInClicked, createUserClicked}) {
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
                value={$email}
                onChange={e => fieldChanged({
                  field: 'user.signIn.$email',
                  value: e.target.value
                })}
                name='login'
                />
              <i className='fa fa-user' />
            </p>
            <p className='control has-icon'>
              <input className='input' type='password'
                placeholder={t.loginPasswordPlaceholder}
                value={$password}
                onChange={e => fieldChanged({
                  field: 'user.signIn.$password',
                  value: e.target.value
                })}
                name='password'
                />
              <i className='fa fa-key' />
            </p>

            <nav className='level'>
              <div className='level-left' />
              <div className='level-right'>
                <div className='level-item'>
                  <p className='control'>
                    <button
                      className='button is-primary'
                      onClick={() => signInClicked()}
                    >
                      {t.loginSignInButton}
                    </button>
                  </p>
                </div>
                <div className='level-item'>
                  <p className='control'>
                    <button
                      className='button is-primary'
                      onClick={() => createUserClicked()}
                    >
                      {t.loginCreateUserButton}
                    </button>
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
