import { init as initClients } from '../../clients'
import { init as initProjects } from '../../projects'
import { init as initTasks } from '../../tasks'

export default [...initClients, ...initProjects, ...initTasks]
