import React from 'react'
import { connect } from 'cerebral/react'
import translations from '../../computed/translations'
import LangSelector from '../LangSelector'
import Input from './Input'

export default connect(
  {
    t: translations,
    email: 'user.$signIn.email',
    password: 'user.$signIn.password',
    validationErrors: 'user.$signIn.validationErrors',
    error: 'user.$signIn.error'
  },
  {
    fieldChanged: 'user.fieldChanged',
    signInClicked: 'user.signInClicked',
    createUserClicked: 'user.createUserClicked'
  },
  function Login ({
    t,
    // state
    email,
    password,
    validationErrors,
    error,
    // signals
    fieldChanged,
    signInClicked,
    createUserClicked
  }) {
    let emailValidationMessage = ''
    let passwordValidationMessage = ''

    function validate () {
      // validate email
      let hasValidationError = validationErrors && validationErrors.EMAIL_EMPTY
      if (hasValidationError) {
        emailValidationMessage = t.loginValidationEmailRequired
      } else if (error) {
        let translation = t.loginErrors[error.code]
        emailValidationMessage = translation || error.message
      }

      // validate password
      hasValidationError = validationErrors && validationErrors.PASSWORD_EMPTY
      if (hasValidationError) {
        passwordValidationMessage = t.loginValidationPasswordRequired
      }
    }

    validate()

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
              fieldType='email'
              placeholder={t.loginEmailPlaceholder}
              value={email}
              onChange={e => fieldChanged({
                field: 'user.$signIn.email',
                value: e.target.value
              })}
              message={emailValidationMessage}
              icon='fa fa-user'
            />

            <Input
              fieldType='password'
              placeholder={t.loginPasswordPlaceholder}
              value={password}
              onChange={e => fieldChanged({
                field: 'user.$signIn.password',
                value: e.target.value
              })}
              message={passwordValidationMessage}
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
