import {debounce, input, set, state, when} from 'cerebral/operators'
import paths from '../../../common/Collection/paths'

import updateDraft from '../../../common/Collection/signals/updateDraft'
import save from '../../../common/Collection/signals/save'

const updateDraftFactory = (moduleName) => {
  const {draftPath} = paths(moduleName)
  return [
    ...updateDraft(moduleName),
    when(state`${draftPath}.key`, state`${draftPath}.startedAt`,
      (key, startedAt) => startedAt && key === 'running'
    ), {
      true: [
        // Updates to the running task are saved as they
        // are made.
        debounce(1000), {
          continue: [
            set(input`key`, state`${draftPath}.key`),
            set(input`value`, state`${draftPath}`),
            ...save(moduleName), {
              success: [],
              error: []
            }
          ],
          discard: []
        }
      ],
      false: []
    }
  ]
}

export default updateDraftFactory('tasks')
