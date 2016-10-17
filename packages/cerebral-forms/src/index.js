import isValidFormHelper from './helpers/isValidForm'
import isValidFormFactory from './factories/isValidForm'

export {default as form} from './form'
export {default as rules} from './rules'

export {default as changeField} from './chains/changeField'

export {default as validateField} from './factories/validateField'
export {default as validateForm} from './factories/validateForm'
export {default as resetForm} from './factories/resetForm'

export {default as formToJSON} from './helpers/formToJSON'
export {default as getFormFields} from './helpers/getFormFields'
export {default as getInvalidFormFields} from './helpers/getInvalidFormFields'

export function isValidForm (form) {
  if (typeof form === 'string') {
    return isValidFormFactory(form)
  }

  return isValidFormHelper(form)
}
