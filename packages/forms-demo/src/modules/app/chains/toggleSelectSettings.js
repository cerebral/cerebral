import unToggleSettings from '../actions/unToggleSettings'
import hidePanel from '../actions/hidePanel'
import {changeField} from 'cerebral-forms'
import {when, input} from 'cerebral/operators'

export default [
  ...changeField,
  when(input`value`), {
    true: [
      hidePanel,
      unToggleSettings
    ],
    false: [
    ]
  }
]
