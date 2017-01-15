import {Computed} from 'cerebral'
import {state} from 'cerebral/tags'

export default Computed({
  repos: state`repos`
}, ({repos}) => {
  return Object.keys(repos).reduce((currentCount, repoKey) => {
    return currentCount + repos[repoKey].stargazers_count
  }, 0)
})
