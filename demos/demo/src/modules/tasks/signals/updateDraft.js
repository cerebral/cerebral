import {debounce, set, when} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'
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
            set(props`key`, state`${draftPath}.key`),
            set(props`value`, state`${draftPath}`),
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
