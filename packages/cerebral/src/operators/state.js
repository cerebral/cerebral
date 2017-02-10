import Tag from '../tags/Tag'

export default function state (strings, ...values) {
  console.warn('Importing state from cerebral/operators is deprecated, import it from cerebral/tags')
  return new Tag('state', {}, strings, values)
}
