import unToggleSettings from '../actions/unToggleSettings'
import {changeField} from 'cerebral-forms'
import {when, input} from 'cerebral/operators'

export default [
  ...changeField,
  when(input`value`), {
    true: [
      unToggleSettings
    ],
    false: [
    ]
  }
]
