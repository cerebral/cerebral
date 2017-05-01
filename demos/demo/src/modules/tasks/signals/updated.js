import {unset, when} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'
import updated from '../../../common/Collection/signals/updated'
import updateNow from './updateNow'
import {isRunning} from '../helpers'

export default [
  // We have a running task
  when(props`value`, isRunning), {
    true: [...updateNow],
    false: [
      when(props`value.key`, key => key === 'running'), {
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
