import {input, set, state, when} from 'cerebral/operators'
import {paths} from '../../common/Collection/paths'

import updateDraft from '../../common/Collection/signals/updateDraft'
import update from '../../common/Collection/signals/update'

const updateDraftFactory = (moduleName) => {
  const {draftPath} = paths(moduleName)
  return [
    ...updateDraft(moduleName),
    when(state`${draftPath}.key`, key => key === 'running'), {
      true: [
        ...update(moduleName),
        set(state`${draftPath}`, input`value`)
      ],
      false: []
    }
  ]
}

export default updateDraftFactory('tasks')
