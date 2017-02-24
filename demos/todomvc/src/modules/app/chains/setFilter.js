import {all, set} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'

export default [
  set(state`app.filter`, props`filter`),
  all(
    function testA () {

    },
    function testB () {

    }
  )
]
