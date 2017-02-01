import {set, when} from 'cerebral/operators'
import {state, input, string} from 'cerebral/tags'
import showToast from '../../../common/factories/showToast'
import getRepo from '../../../common/factories/getRepo'
import starsCount from '../../../computeds/starsCount'

export default [
  set(state`app.activeTab`, 'repos'),
  ...showToast(string`Loading data for repos`),
  [
    getRepo('cerebral'),
    getRepo('addressbar')
  ],
  when(input`error`), {
    true: [
      ...showToast(string`Error: ${input`error`}`, 5000, 'error')
    ],
    false: [
      set(state`repos.list.cerebral`, input`cerebral`),
      set(state`repos.list.addressbar`, input`addressbar`),
      ...showToast(string`The repos have ${starsCount} stars`, 5000, 'success')
    ]
  }
]
