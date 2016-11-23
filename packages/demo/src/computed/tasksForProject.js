import {Computed} from 'cerebral'

export default Computed(
  {
    tasks: 'tasks.all.**'
  },
  ({itemKey, tasks}) => (
    Object.keys(tasks).map(key => tasks[key]).filter(task => (task.projectKey === itemKey))
  )
)
