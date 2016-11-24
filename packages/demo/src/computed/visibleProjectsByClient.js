import {Computed} from 'cerebral'
import visibleProjectKeys from './visibleProjectKeys'

export default Computed(
  {
    projectKeys: visibleProjectKeys,
    projects: 'projects.all.**',
    clients: 'clients.all.**'
  },
  ({projectKeys, projects, clients}) => {
    const clientList = {}
    const result = []
    projectKeys.forEach(key => {
      const project = projects[key]
      const clientKey = project.clientKey || 'no-client'
      let list = clientList[clientKey]
      if (!list) {
        list = []
        clientList[clientKey] = list
        result.push({
          key: clientKey,
          name: clients[clientKey].name,
          projects: list
        })
      }
      list.push(project)
    })
    result.sort((a, b) => {
      if (a.key === 'no-client') {
        return -1
      } else if (b.key === 'no-client') {
        return 1
      } else {
        return a.name <= b.name ? -1 : 0
      }
    })
    return result
  }
)
