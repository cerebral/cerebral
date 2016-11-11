import {Computed} from 'cerebral'
import clientList from './clientList'

export default Computed(
  {
    clients: clientList,
    filter: 'clients.$filter'
  },
  ({clients, filter}) => {
    const f = filter.toLowerCase()
    return clients.filter(client => (
      !filter || client.name.toLowerCase().indexOf(f) >= 0
    )).map(client => client.ref)
  }
)
