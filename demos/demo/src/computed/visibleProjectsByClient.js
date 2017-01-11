import {Computed} from 'cerebral'
import {state} from 'cerebral/tags'
import visibleKeys from '../common/Collection/computed/visibleKeys'
import paths from '../common/Collection/paths'

const projectsPath = paths('projects').collectionPath
const clientsPath = paths('clients').collectionPath

export default Computed(
  {
    visibleProjectKeys: visibleKeys('projects'),
    projects: state`${projectsPath}.**`,
    clients: state`${clientsPath}.**`
  },
  ({visibleProjectKeys, projects, clients}) => {
    const clientList = {}
    const result = []
    visibleProjectKeys.forEach(key => {
      const project = projects[key]
      if (!project) {
        // Not saved yet
        return
      }
      const client = clients[project.clientKey] || clients['no-client']
      const clientKey = client.key
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
