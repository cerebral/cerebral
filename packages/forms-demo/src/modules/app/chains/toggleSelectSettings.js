import unToggleSettings from '../actions/unToggleSettings'
import hidePanel from '../actions/hidePanel'
import {changeField} from 'cerebral-forms'
import {when} from 'cerebral/operators'
import {input} from 'cerebral/tags'

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
