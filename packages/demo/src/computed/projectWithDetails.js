import {Computed} from 'cerebral'
import tasksForProject from './tasksForProject'

export default Computed(
  ({projectRef}) => ({
    clients: 'clients.all.**',
    project: `projects.all.${projectRef}.**`,
    tasks: tasksForProject.props({projectRef})
  }),
  function projectWithDetails ({clients, project, projectRef, tasks}) {
    const elapsed = tasks.reduce((sum, t) => sum + t.elapsed, 0)
    const client = clients[project.clientRef]
    return Object.assign({}, project, {client, elapsed})
  }
)
