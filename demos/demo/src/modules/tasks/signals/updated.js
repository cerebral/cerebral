import {unset, when} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'
import updated from '../../../common/Collection/signals/updated'
import updateNow from './updateNow'
import {isRunning} from '../helpers'

export default [
  // We have a running task
  when(input`value`, isRunning), {
    true: [...updateNow],
    false: [
      when(input`value.key`, key => key === 'running'), {
        true: [
          // stop timer
          unset(state`tasks.$now`)
        ],
        false: []
      }
    ]
  },
  ...updated('tasks')
]
