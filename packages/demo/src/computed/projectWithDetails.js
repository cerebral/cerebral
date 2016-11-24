import {Computed} from 'cerebral'
import tasksForProject from './tasksForProject'
import {elapsedSeconds} from '../helpers/dateTime'

export default Computed(
  ({itemKey}) => ({
    clients: 'clients.all.**',
    now: 'tasks.$now',
    project: `projects.all.${itemKey}.**`,
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
