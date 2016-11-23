import setPaths from '../../common/signals/setPaths'
import remove from '../../common/signals/remove'

export default [
  ...setPaths('tasks'),
  ...remove
]
