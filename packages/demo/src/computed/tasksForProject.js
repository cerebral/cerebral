import {Computed} from 'cerebral'
import paths from '../common/Collection/paths'

const {collectionPath} = paths('tasks')

export default Computed(
  {
    tasks: `${collectionPath}.**`
  },
  ({itemKey, tasks}) => (
    Object.keys(tasks).map(key => tasks[key]).filter(task => (task.projectKey === itemKey))
  )
)
