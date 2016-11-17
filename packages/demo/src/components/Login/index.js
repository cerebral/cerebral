import React from 'react'
import { connect } from 'cerebral/react'
import translations from '../../computed/translations'
import LangSelector from '../LangSelector'

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
    signInClicked: 'user.$signInClicked',
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
    function getField ({
      field,
      icon,
      value,
      placeholder,
      fieldType,
      message
    }) {
      return (
        <p className='control has-icon'>
          <input className='input'
            type={fieldType}
            placeholder={placeholder}
            value={value}
            onChange={e => fieldChanged({
              field,
              value: e.target.value
            })}
          />
          {message && (
            <i className='fa fa-warning' />
          )}
          {message && (
            <span className='help is-danger'>
              {message}
            </span>
          )}
          {!message && (
            <i className={icon} />
          )}
        </p>
      )
    }

    function getEmail () {
      let hasValidationError = validationErrors && validationErrors.EMAIL_EMPTY
      let hasError = error
      let message = ''
      if (hasValidationError) {
        message = t.loginValidationEmailRequired
      } else if (hasError) {
        let translation = t.loginErrors[ error.code ]
        message = translation || error.message
      }
      return getField({
        field: 'user.$signIn.email',
        icon: 'fa fa-user',
        value: email,
        placeholder: t.loginEmailPlaceholder,
        fieldType: 'email',
        message: message
      })
    }

    function getPassword () {
      let hasValidationError = validationErrors && validationErrors.PASSWORD_EMPTY
      let message = ''
      if (hasValidationError) {
        message = t.loginValidationPasswordRequired
      }
      return getField({
        field: 'user.$signIn.password',
        icon: 'fa fa-key',
        value: password,
        placeholder: t.loginPasswordPlaceholder,
        fieldType: 'password',
        message: message
      })
    }

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

            {getEmail()}
            {getPassword()}

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
