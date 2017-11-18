import { Provider } from 'cerebral'
import { state } from 'cerebral/tags'
import form from './form'
import rules from './rules'
import resetForm from './helpers/resetForm'
import formToJSON from './helpers/formToJSON'
export { default as form } from './form'
export { default as rules } from './rules'
export { computedField as field } from './form'

function FormsProvider(options = {}) {
  if (options.rules) {
    Object.assign(rules, options.rules)
  }

  if (options.errorMessages) {
    rules._errorMessages = options.errorMessages
  }

  return Provider({
    get(path) {
      return this.context.resolve.value(form(state`${path}`))
    },
    reset(path) {
      this.context.state.set(path, resetForm(this.context.state.get(path)))
    },
    toJSON(path) {
      return formToJSON(this.context.state.get(path))
    },
    updateRules(newRules) {
      Object.assign(rules, newRules)
    },
    updateErrorMessages(errorMessages) {
      Object.assign(rules._errorMessages, errorMessages)
    },
  })
}

export default FormsProvider
