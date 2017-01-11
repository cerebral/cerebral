import {Computed} from 'cerebral'
import {state} from 'cerebral/tags'
import paths from '../common/Collection/paths'

const {collectionPath} = paths('tasks')

export default Computed(
  {
    tasks: state`${collectionPath}.**`
  },
  ({itemKey, tasks}) => (
    Object.keys(tasks).map(key => tasks[key]).filter(task => (task.projectKey === itemKey))
  )
)
