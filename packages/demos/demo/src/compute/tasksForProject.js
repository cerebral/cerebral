import { compute } from 'cerebral'
import { state } from 'cerebral/tags'
import paths from '../common/Collection/paths'

const { collectionPath } = paths('tasks')

export default passedItemKey => {
  return compute(passedItemKey, state`${collectionPath}`, (itemKey, tasks) =>
    Object.keys(tasks)
      .map(key => tasks[key])
      .filter(task => task.projectKey === itemKey)
  )
}
