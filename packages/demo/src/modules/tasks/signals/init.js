import {input, set, state, when} from 'cerebral/operators'
import init from '../../../common/Collection/signals/init'
import paths from '../../../common/Collection/paths'
import updated from './updated'

const moduleName = 'tasks'
const {collectionPath} = paths(moduleName)

export default [
  ...init(moduleName),
  when(state`${collectionPath}.running`), {
    true: [
      set(input`value`, state`${collectionPath}.running`),
      set(input`key`, 'running'),
      ...updated
    ],
    false: []
  }
]
