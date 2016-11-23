import setPaths from '../../common/signals/setPaths'
import changed from '../../common/signals/changed'

export default [
  ...setPaths('tasks'),
  ...changed
]
