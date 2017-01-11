import DataStore from './stores/DataStore'
import ViewStore from './stores/ViewStore'

export default {
  data: new DataStore(),
  view: new ViewStore()
}
