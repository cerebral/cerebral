import {set, unset, when} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'
import getUser from '../user/actions/getUser'
import firebaseInit from './signals/firebaseInit'

export default {
  state: {
    $selectedView: 'Today',
    $lang: 'en',
    $loading: true
  },
  signals: {
    bootstrap: [
      when(state`user.$loggedIn`), {
        true: [],
        false: [
          getUser, {
            success: [
              set(state`user.$loggedIn`, true),
              set(state`user.$currentUser`, input`user`),
              ...firebaseInit
            ],
            error: [
              set(state`user.$loggedIn`, false)
            ]
          }
        ]
      },
      set(state`app.$loading`, false)
    ],
    dismissNotificationClicked: [
      unset(state`app.$error`)
    ],
    routed: [
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
