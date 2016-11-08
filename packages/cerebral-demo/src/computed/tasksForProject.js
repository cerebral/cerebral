import {Computed} from 'cerebral'

export default Computed(
  {
    tasks: 'tasks.all.**'
  },
  ({projectRef, tasks}) => (
    Object.keys(tasks).map(ref => tasks[ref]).filter(task => (task.projectRef === projectRef))
  )
)
