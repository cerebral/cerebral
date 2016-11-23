import {Computed} from 'cerebral'
import tasksForProject from './tasksForProject'

export default Computed(
  ({itemKey}) => ({
    clients: 'clients.all.**',
    project: `projects.all.${itemKey}.**`,
    tasks: tasksForProject.props({itemKey})
  }),
  function projectWithDetails ({clients, project, tasks}) {
    const elapsed = tasks.reduce((sum, t) => sum + t.elapsed, 0)
    const client = clients[project.clientKey]
    return Object.assign({}, project, {client, elapsed})
  }
)
