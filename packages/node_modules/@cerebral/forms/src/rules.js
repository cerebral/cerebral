/* eslint-disable no-useless-escape, no-control-regex */
import { state } from 'cerebral/tags'

const rules = {
  _errorMessages: {},
  isExisty(value) {
    return value !== null && value !== undefined
  },
  isEmpty(value) {
    return value === ''
  },
  regexp(value, regexp) {
    return !rules.isExisty(value) || rules.isEmpty(value) || regexp.test(value)
  },
  isValue(value) {
    return (
      value !== undefined &&
      value !== '' &&
      value !== null &&
      value !== false &&
      (!Array.isArray(value) || !!value.length)
    )
  },
  isUndefined(value) {
    return value === undefined
  },
  isEmail(value) {
    return rules.regexp(
      value,
      /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
    )
  },
  isUrl(value) {
    return rules.regexp(
      value,
      /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
    )
  },
  isTrue(value) {
    return value === true
  },
  isFalse(value) {
    return value === false
  },
  isNumeric(value) {
    if (typeof value === 'number') {
      return true
    }

    return rules.regexp(value, /^[-+]?(?:\d*[.])?\d+$/)
  },
  isAlpha(value) {
    return rules.regexp(value, /^[A-Z]+$/i)
  },
  isAlphanumeric(value) {
    return rules.regexp(value, /^[0-9A-Z]+$/i)
  },
  isInt(value) {
    return rules.regexp(value, /^(?:[-+]?(?:0|[1-9]\d*))$/)
  },
  isFloat(value) {
    return rules.regexp(
      value,
      /^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][\+\-]?(?:\d+))?$/
    )
  },
  isWords(value) {
    return rules.regexp(value, /^[A-Z\s]+$/i)
  },
  isSpecialWords(value) {
    return rules.regexp(value, /^[A-Z\s\u00C0-\u017F]+$/i)
  },
  isLength(value, length) {
    return value.length === length
  },
  equals(value, eql) {
    return value === eql
  },
  equalsField(value, field, get) {
    return value === get(state`${field}.value`)
  },
  maxLength(value, length) {
    return !rules.isExisty(value) || value.length <= length
  },
  minLength(value, length) {
    return (
      !rules.isExisty(value) || rules.isEmpty(value) || value.length >= length
    )
  },
}

export default rules
