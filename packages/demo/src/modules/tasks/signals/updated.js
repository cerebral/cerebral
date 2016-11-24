import {input, set, state, when} from 'cerebral/operators'
import {paths} from '../../common/Collection/paths'

import updated from '../../common/Collection/signals/updated'

const updatedFactory = (moduleName) => {
  const {draftPath} = paths(moduleName)
  return [
    ...updated(moduleName),
    when(input`key`, key => key === 'running'), {
      true: [
        when(state`${draftPath}.key`, key => key === 'running'), {
          true: [
            set(state`${draftPath}`, input`value`)
          ],
          false: []
        }
      ],
      false: []
    }
  ]
}

export default updatedFactory('tasks')
