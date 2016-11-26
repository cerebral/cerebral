import projectSelectorClose from './projectSelectorClose'
import updateTaskDraft from '../../tasks/signals/updateDraft'

export default [
  ...updateTaskDraft,
  ...projectSelectorClose
]
