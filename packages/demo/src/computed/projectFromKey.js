import {Computed} from 'cerebral'

export default Computed(
  ({itemKey}) => ({
    project: `projects.all.${itemKey}.**`
  }),
  ({project}) => project
)
