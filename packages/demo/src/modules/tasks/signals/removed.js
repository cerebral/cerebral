import setPaths from '../../common/signals/setPaths'
import removed from '../../common/signals/removed'

export default [
  ...setPaths('tasks'),
  ...removed
]
