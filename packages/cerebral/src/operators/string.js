import Tag from '../tags/Tag'

export default function string (strings, ...values) {
  console.warn('Importing string from cerebral/operators is deprecated, import it from cerebral/tags')
  return new Tag('string', {
    hasValue: false
  }, strings, values)
}
