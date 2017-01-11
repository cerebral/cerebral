import React from 'react'
import {connect} from 'cerebral/react'
import {signal, state} from 'cerebral/tags'
import translations from '../../common/computed/translations'
import Input from './Input'

export default connect(
  {
    buttonClick: signal`user.createUserClicked`,
    enterPress: signal`user.createUserEnterPressed`,
    fieldChange: signal`user.fieldChanged`,
    signIn: state`user.$signIn.**`,
    t: translations
  },
  function Login ({buttonClick, enterPress, fieldChange, signIn, t}) {
    const showError = field => signIn.showErrors && !field.isValid

    return (
      <div>
        <h2 className='title'>{t.createAccount}</h2>

        <Input
          icon='fa fa-user'
          message={t[signIn.email.errorMessage]}
          placeholder={t.loginEmailPlaceholder}
          showError={showError(signIn.email)}
          value={signIn.email.value}
          onChange={e => fieldChange({
            field: 'user.$signIn.email',
            value: e.target.value
          })}
          onEnter={e => enterPress()}
        />

        <Input
          fieldType='password'
          icon='fa fa-user'
          message={t[signIn.password.errorMessage]}
          placeholder={t.loginPasswordPlaceholder}
          showError={showError(signIn.password)}
          value={signIn.password.value}
          onChange={e => fieldChange({
            field: 'user.$signIn.password',
            value: e.target.value
          })}
          onEnter={e => enterPress()}
        />

        <nav className='level'>
          <div className='level-left' />
          <div className='level-right'>
            <div className='level-item'>
              <p className='control'>
                <button
                  className='button is-primary'
                  onClick={() => buttonClick()}
                >
                  {t.loginCreateUser}
                </button>
              </p>
            </div>
          </div>
        </nav>

      </div>
    )
  }
)
