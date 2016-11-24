import {input, when} from 'cerebral/operators'
import updated from '../../common/Collection/signals/updated'
import updateNow from './updateNow'

export default [
  // We have a running task
  when(input`value.elapsed`,
    elapsed => typeof elapsed !== 'number'
  ), {
    true: [
      () => {console.log('UPDATE NOW')},
      ...updateNow],
    false: []
  },
  updated('tasks')
]
