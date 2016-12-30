import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'
import {form} from 'cerebral-forms'
import toggleSelectSettings from './chains/toggleSelectSettings'

export default {
  state: {
    currentView: 'Simple',
    settings: form({
      validateOnChange: {
        value: true,
        description: 'Show error messages on change',
        unToggleFieldsWhenChecked: ['app.settings.validateInputOnBlur', 'app.settings.validateFormOnSubmit']
      },
      disableSubmitWhenFormIsInValid: {
        value: false,
        description: 'Disable submit when form is invalid',
        neverHidePanel: true
      },
      validateInputOnBlur: {
        value: false,
        description: 'Show error message on blur',
        unToggleFieldsWhenChecked: ['app.settings.validateOnChange', 'app.settings.validateFormOnSubmit']
      },
      validateFormOnSubmit: {
        value: false,
        description: 'Show error message on submit',
        unToggleFieldsWhenChecked: ['app.settings.validateOnChange', 'app.settings.validateInputOnBlur']
      },
      showErrors: false
    })
  },
  signals: {
    routed: [
      set(state`app.currentView`, 'Simple')
    ],
    toggleSelectSettings
  }
}
