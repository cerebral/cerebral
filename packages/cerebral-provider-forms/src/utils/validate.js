import rules from '../rules.js'

export default function validate (form, value, validationRules) {
  const initialValidation = {
    isValid: true,
    failedRuleIndex: null
  }

  if (!validationRules) {
    return initialValidation
  }

  return validationRules.reduce((result, validationRule, index) => {
    if (!result.isValid) {
      return result
    }

    let validation

    // Convert string to object form
    if (typeof validationRule === 'string') {
      const args = validationRule.split(/:(.+)?/)

      validation = {}

      if (args[1]) {
        try {
          validation[args[0]] = JSON.parse(args[1])
        } catch (e) {
          validation[args[0]] = args[1]
        }
      } else {
        validation[args[0]] = undefined
      }
    } else {
      validation = validationRule
    }

    const isValidResult = Object.keys(validation).reduce((currentIsValidResult, key) => {
      if (!currentIsValidResult.isValid) {
        return currentIsValidResult
      }

      const rule = rules[key] || function () {
        throw new Error(`Rule ${key} is not found`)
      }

      return {
        isValid: rule(value, form, validation[key]),
        key,
        value,
        args: validation[key]
      }
    }, {
      isValid: true,
      value: null,
      key: null,
      args: null
    })

    return {
      isValid: isValidResult.isValid,
      failedRuleIndex: index,
      errorMessage: rules._errorMessages[isValidResult.key] ? rules._errorMessages[isValidResult.key](isValidResult.value, isValidResult.args) : null
    }
  }, initialValidation)
}
