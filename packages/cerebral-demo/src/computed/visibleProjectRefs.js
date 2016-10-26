import {Computed} from 'cerebral'

export default Computed(
  {
    projects: 'projects.all.**',
    filter: 'projects.$filter'
  },
  ({projects, filter}) => {
    const f = filter.toLowerCase()
    return Object.keys(projects).filter((ref) => (
      !filter || projects[ref].name.toLowerCase().indexOf(f) >= 0
    ))
  }
)
