import Tag from '../tags/Tag'

export default function input (strings, ...values) {
  console.warn('Importing input from cerebral/operators is deprecated, import it from cerebral/tags')
  return new Tag('input', {}, strings, values)
}
