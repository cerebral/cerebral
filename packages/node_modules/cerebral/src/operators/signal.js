import Tag from '../tags/Tag'

export default function signal (strings, ...values) {
  console.warn('Importing signal from cerebral/operators is deprecated, import it from cerebral/tags')
  return new Tag('signal', {}, strings, values)
}
