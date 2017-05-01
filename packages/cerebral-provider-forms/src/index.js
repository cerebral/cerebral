import {state} from 'cerebral/tags'
import form from './form'
import rules from './rules'
import resetForm from './helpers/resetForm'
import formToJSON from './helpers/formToJSON'
export {default as form} from './form'
export {default as rules} from './rules'
export {computedField as field} from './form'

function FormsProvider (options = {}) {
  if (options.rules) {
    Object.assign(rules, options.rules)
  }

  if (options.errorMessages) {
    rules._errorMessages = options.errorMessages
  }

  return (context) => {
    context.forms = {
      get (path) {
        return context.resolve.value(form(state`${path}`))
      },
      reset (path) {
        context.state.set(path, resetForm(context.state.get(path)))
      },
      toJSON (path) {
        return formToJSON(context.state.get(path))
      },
      updateRules (newRules) {
        Object.assign(rules, newRules)
      },
      updateErrorMessages (errorMessages) {
        Object.assign(rules._errorMessages, errorMessages)
      }
    }

    if (context.debugger) {
      context.debugger.wrapProvider('forms')
    }

    return context
  }
}

export default FormsProvider
