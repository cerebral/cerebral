import rules from '../rules.js'

export default function validate(value, validationRules = [], get) {
  const initialValidation = {
    isValid: true,
  }

  return validationRules.reduce((result, validationRule, index) => {
    if (!result.isValid) {
      return result
    }

    const ruleArray =
      validationRule instanceof RegExp
        ? ['regexp']
        : validationRule.split(/:(.+)?/)
    const ruleKey = ruleArray[0]
    const rule =
      rules[ruleKey] ||
      function() {
        throw new Error(`Rule ${ruleKey} is not found`)
      }
    let arg

    if (validationRule instanceof RegExp) {
      arg = validationRule
    } else if (typeof ruleArray[1] !== 'undefined') {
      try {
        arg = JSON.parse(ruleArray[1])
      } catch (e) {
        arg = ruleArray[1]
      }
    } else {
      arg = undefined
    }

    const isValid = rule(value, arg, get)

    return isValid
      ? initialValidation
      : {
          isValid,
          failedRule: {
            name: ruleKey,
            arg,
          },
          errorMessage: rules._errorMessages[ruleKey]
            ? rules._errorMessages[ruleKey](value, arg)
            : null,
        }
  }, initialValidation)
}
