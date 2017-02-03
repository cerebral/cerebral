import {set, when} from 'cerebral/operators'
import {state, props, string} from 'cerebral/tags'
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
  when(props`error`), {
    true: [
      ...showToast(string`Error: ${props`error`}`, 5000, 'error')
    ],
    false: [
      set(state`repos.list.cerebral`, props`cerebral`),
      set(state`repos.list.addressbar`, props`addressbar`),
      ...showToast(string`The repos have ${starsCount} stars`, 5000, 'success')
    ]
  }
]
