import {input, set, state, unset} from 'cerebral/operators'
import getCurrentUser from '../common/signals/getCurrentUser'

export default {
  state: {
    $selectedView: 'Today',
    $lang: 'en'
  },
  signals: {
    routed: [
      ...getCurrentUser,
      set(state`app.$selectedView`, 'Today')
    ],
    langOptionClicked: [
      set(state`user.lang`, input`lang`),
      unset(state`app.$showLangSelector`)
    ],
    langSelectorClicked: [
      set(state`app.$showLangSelector`, true)
    ],
    langSelectorBackgroundClicked: [
      unset(state`app.$showLangSelector`)
    ]
  }
}
