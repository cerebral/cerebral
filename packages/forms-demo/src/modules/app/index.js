import {set, state} from 'cerebral/operators'
import {form} from 'cerebral-forms'
import toggleSelectSettings from './chains/toggleSelectSettings'

export default {
  state: {
    currentView: 'Simple',
    settings: form({
      /**
      validateOnChange: {
        value: true,
        description: 'Show error messages on change',
        unToggleFieldsWhenChecked: ['app.settings.validateInputOnBlur']
      },
      */
      disableSubmitWhenFormIsInValid: {
        value: false,
        description: 'Disable submit when form is invalid'
      }
      /** ,
      validateInputOnBlur: {
        value: false,
        description: 'Show error message on blur',
        unToggleFieldsWhenChecked: ['app.settings.validateOnChange']
      }
      */
    })
  },
  signals: {
    routed: [
      set(state`app.currentView`, 'Simple')
    ],
    toggleSelectSettings
  }
}
