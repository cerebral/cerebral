import { set, state } from 'cerebral/operators'

export default {
  state: {toast: {
    messages: []
  },
    activeTab: 'StateAndActions'
  },
  signals: {
    stateAndActionsRouted: [
      set(state`app.activeTab`, 'StateAndActions')
    ],
    gitHubRouted: [
      set(state`app.activeTab`, 'Github')
    ],
    unknownRouted: [
      set(state`app.activeTab`, 'StateAndActions')
    ]
  },
  modules: {}
}
