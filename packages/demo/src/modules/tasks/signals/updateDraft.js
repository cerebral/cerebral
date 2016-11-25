import {debounce, state, when} from 'cerebral/operators'
import paths from '../../../common/Collection/paths'

import updateDraft from '../../../common/Collection/signals/updateDraft'
import update from '../../../common/Collection/signals/update'

const updateDraftFactory = (moduleName) => {
  const {draftPath} = paths(moduleName)
  return [
    ...updateDraft(moduleName),
    when(state`${draftPath}.key`, key => key === 'running'), {
      true: [
        debounce(400, [
          ...update(moduleName)
        ])
      ],
      false: []
    }
  ]
}

export default updateDraftFactory('tasks')
