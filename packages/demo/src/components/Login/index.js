import React from 'react'
import { connect } from 'cerebral/react'
import translations from '../../computed/translations'
import LangSelector from '../LangSelector'
import Input from './Input'

export default connect(
  {
    t: translations,
    signIn: 'user.$signIn.**'
  },
  {
    fieldChanged: 'user.fieldChanged',
    signInClicked: 'user.signInClicked',
    createUserClicked: 'user.createUserClicked'
  },
  function Login ({
    t,
    // state
    signIn,
    // signals
    fieldChanged,
    signInClicked,
    createUserClicked
  }) {
    const showError = field => signIn.showErrors && !field.isValid

    return (
      <div className='modal is-active'>
        <div className='modal-background' />
        <div className='modal-content'>
          <div className='box'>

            <nav className='nav'>
              <div className='nav-left'>
                <h2 className='title'>{t.pleaseLogin}</h2>
              </div>
              <div className='nav-right'>
                <div className='nav-item'>
                  <LangSelector />
                </div>
              </div>
            </nav>

            <Input
              placeholder={t.loginEmailPlaceholder}
              value={signIn.email.value}
              onChange={e => fieldChanged({
                field: 'user.$signIn.email',
                value: e.target.value
              })}
              message={t[signIn.email.errorMessage]}
              showError={showError(signIn.email)}
              icon='fa fa-user'
            />

            <Input
              fieldType='password'
              placeholder={t.loginPasswordPlaceholder}
              value={signIn.password.value}
              onChange={e => fieldChanged({
                field: 'user.$signIn.password',
                value: e.target.value
              })}
              message={t[signIn.password.errorMessage]}
              showError={showError(signIn.password)}
              icon='fa fa-user'
            />

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
