import {Computed} from 'cerebral'
import visibleProjectRefs from './visibleProjectRefs'

export default Computed(
  {
    projectRefs: visibleProjectRefs,
    projects: 'projects.all.**',
    clients: 'clients.all.**'
  },
  ({projectRefs, projects, clients}) => {
    const clientList = {}
    const result = []
    projectRefs.forEach(ref => {
      const project = projects[ref]
      const clientRef = project.clientRef
      let list = clientList[clientRef]
      if (!list) {
        list = []
        clientList[clientRef] = list
        result.push({
          ref: clientRef,
          name: clients[clientRef].name,
          projects: list
        })
      }
      list.push(project)
    })
    result.sort((a, b) => {
      if (a.ref === 'no-client') {
        return -1
      } else if (b.ref === 'no-client') {
        return 1
      } else {
        return a.name <= b.name ? -1 : 0
      }
    })
    return result
  }
)
