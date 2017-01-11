import {set} from 'cerebral/operators'
import {state, input} from 'cerebral/tags'
import showToast from '../../../common/factories/showToast'
import getRepo from '../../../common/factories/getRepo'

export default [
  set(state`app.activeTab`, 'repos'),
  ...showToast('Loading data for repos...'),
  [
    getRepo('cerebral'), {
      success: [set(state`repos.list.cerebral`, input`data`)],
      error: []
    },
    getRepo('addressbar'), {
      success: [set(state`repos.list.addressbar`, input`data`)],
      error: []
    }
  ],
  ...showToast('Repos loaded', 2000, 'success')
]
