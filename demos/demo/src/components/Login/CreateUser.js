import React from 'react'
import {connect} from 'cerebral/react'
import {signal, state} from 'cerebral/tags'
import translations from '../../common/compute/translations'
import Input from './Input'
import {form} from 'cerebral-provider-forms'
import resolveTranslation from '../../helpers/resolveTranslation'

export default connect(
  {
    buttonClick: signal`user.createUserClicked`,
    enterPress: signal`user.createUserEnterPressed`,
    fieldChange: signal`user.fieldChanged`,
    signIn: form(state`user.$signIn`),
    t: translations
  },
  function Login ({buttonClick, enterPress, fieldChange, signIn, t}) {
    const showError = field => signIn.showErrors && !field.isValid

    const error = (fieldName) => {
      const field = signIn[fieldName]
      if (field.failedRule) {
        return resolveTranslation(t, `validationErrors.signIn.${fieldName}.${field.failedRule.name}`)
      }
      return null
    }

    return (
      <div>
        <h2 className='title'>{t.createAccount}</h2>

        <Input
          icon='fa fa-user'
          message={error('email')}
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
          message={error('password')}
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
