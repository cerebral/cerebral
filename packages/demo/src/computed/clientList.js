import {Computed} from 'cerebral'

export default Computed(
  {
    clients: 'clients.all.**'
  },
  function clientList ({clients}) {
    return Object.keys(clients).map(key => clients[key]).sort((a, b) => a.name <= b.name ? -1 : 1)
  }
)
