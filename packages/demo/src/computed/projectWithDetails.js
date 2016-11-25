import {Computed} from 'cerebral'
import paths from '../common/Collection/paths'

import tasksForProject from './tasksForProject'
import {elapsedSeconds} from '../helpers/dateTime'

const projectsPath = paths('projects').collectionPath
const clientsPath = paths('clients').collectionPath

export default Computed(
  ({itemKey}) => ({
    clients: `${clientsPath}.**`,
    now: 'tasks.$now',
    project: `${projectsPath}.${itemKey}.**`,
    tasks: tasksForProject.props({itemKey})
  }),
  function projectWithDetails ({clients, now, project, tasks}) {
    const elapsed = tasks.reduce((sum, t) => (
      sum + (
        typeof t.elapsed === 'number'
          ? t.elapsed
          : elapsedSeconds(t.startedAt, now)
      )
    ), 0)
    const client = clients[project.clientKey] || clients['no-client']
    return Object.assign({}, project, {client, elapsed})
  }
)
