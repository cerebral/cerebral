import {Computed} from 'cerebral'

export default Computed(
  {
    clients: 'clients.all.**'
  },
  function clientList ({clients}) {
    return Object.keys(clients).map(ref => clients[ref]).sort((a, b) => a.name <= b.name ? -1 : 1)
  }
)
