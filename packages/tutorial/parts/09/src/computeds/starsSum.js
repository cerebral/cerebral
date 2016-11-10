import {Computed} from 'cerebral'

export default Computed({
  repos: 'repos'
}, ({repos}) => {
  return Object.keys(repos).reduce((currentCount, repoKey) => {
    return currentCount + repos[repoKey].stargazers_count
  }, 0)
})
