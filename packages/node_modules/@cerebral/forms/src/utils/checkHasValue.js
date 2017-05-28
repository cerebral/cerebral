import validate from './validate'

export default function checkHasValue(value, isValueRules, get) {
  const result = validate(value, isValueRules, get)
  return result.isValid
}
