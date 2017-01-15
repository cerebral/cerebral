import {Computed} from 'cerebral'
import {props, state} from 'cerebral/tags'
import paths from '../common/Collection/paths'

import tasksForProject from './tasksForProject'
import {elapsedSeconds} from '../helpers/dateTime'

const projectsPath = paths('projects').collectionPath
const clientsPath = paths('clients').collectionPath

export default Computed(
  {
    clients: state`${clientsPath}.**`,
    now: state`tasks.$now`,
    project: state`${projectsPath}.${props`itemKey`}.**`,
    tasks: tasksForProject.props({itemKey: props`itemKey`})
  },
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
