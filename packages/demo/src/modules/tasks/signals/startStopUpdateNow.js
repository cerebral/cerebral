import {set, unset, when} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'
import paths from '../../../common/Collection/paths'
import {isRunning} from '../helpers'
import updateNow from './updateNow'

const {draftPath} = paths('tasks')

export default [
  when(input`visible`), {
    true: [
      unset(state`tasks.$nowHidden`),
      // becomes visible again
      when(state`${draftPath}`, isRunning), {
        true: [
          ...updateNow
        ],
        false: []
      }
    ],
    false: [
      set(state`tasks.$nowHidden`, true)
    ]
  }
]
