import {state} from 'cerebral/tags'
import form from './form'
import rules from './rules'
import resetForm from './helpers/resetForm'

export {default as form} from './form'
export {default as rules} from './rules'

function FormsProvider (options = {}) {
  let cachedProvider = null

  function createProvider (context) {
    return {
      get (path) {
        return context.resolve.value(form(state`${path}`))
      },
      reset (path) {
        const pathValue = context.resolve.path(path)

        context.state.set(pathValue, resetForm(context.state.get(pathValue)))
      },
      updateRules (newRules) {
        Object.assign(rules, newRules)
      },
      updateErrorMessages (errormessages) {
        Object.assign(rules._errorMessages, errormessages)
      }
    }
  }

  if (options.rules) {
    Object.assign(rules, options.rules)
  }

  if (options.errorMessages) {
    rules._errorMessages = options.errorMessages
  }

  return (context) => {
    context.forms = cachedProvider = cachedProvider || createProvider(context)

    if (context.debugger) {
      context.debugger.wrapProvider('forms')
    }

    return context
  }
}

export default FormsProvider
