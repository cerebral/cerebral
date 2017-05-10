import unToggleSettings from '../actions/unToggleSettings'
import hidePanel from '../actions/hidePanel'
import {when} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'
import {setField} from '@cerebral/forms/operators'

export default [
  setField(state`${props`field`}`, props`value`),
  when(props`value`), {
    true: [
      hidePanel,
      unToggleSettings
    ],
    false: [
    ]
  }
]
