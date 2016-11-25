import {state, input, set} from 'cerebral/operators'
import showToast from '../../../common/factories/showToast'
import getRepo from '../../../common/factories/getRepo'

export default [
  set(state`app.activeTab`, 'repos'),
  [
    ...showToast('Loading data for repos...', 2000),
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
