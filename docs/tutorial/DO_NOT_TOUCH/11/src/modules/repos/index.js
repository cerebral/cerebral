import openRepos from './chains/openRepos'

export default {
  state: {
    list: {}
  },
  signals: {
    routed: openRepos
  }
}
