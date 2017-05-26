import { set } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'
import paths from '../paths'

export default function(moduleName) {
  const { filterPath } = paths(moduleName)
  return [set(state`${filterPath}`, props`value`)]
}
