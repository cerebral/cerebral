import { set, when } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'
import init from '../../../common/Collection/signals/init'
import paths from '../../../common/Collection/paths'
import updated from './updated'

const moduleName = 'tasks'
const { collectionPath } = paths(moduleName)

export default [
  ...init(moduleName),
  when(state`${collectionPath}.running`),
  {
    true: [
      set(props`value`, state`${collectionPath}.running`),
      set(props`key`, 'running'),
      ...updated,
    ],
    false: [],
  },
]
