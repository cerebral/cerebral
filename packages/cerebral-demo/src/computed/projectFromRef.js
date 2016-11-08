import {Computed} from 'cerebral'

export default Computed(
  ({projectRef}) => ({
    project: `projects.all.${projectRef}.**`
  }),
  ({project}) => project
)
