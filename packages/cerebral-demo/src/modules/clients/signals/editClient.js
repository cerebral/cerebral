import {input, set, state} from 'cerebral/operators'
import draftChanged from '../actions/draftChanged'

export default [
  draftChanged, {
    true: [
      set(state`clients.$nextEditRef`, input`ref`),
      set(state`clients.$showSaveDraftModal`, true)
    ],
    false: [
      set(state`clients.$draft`, state`clients.all.${input`ref`}`)
    ]
  }
]
