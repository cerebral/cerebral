/* eslint-disable */
import {
  when
} from 'cerebral/operators';

import { state, props } from "cerebral/tags";

export default [
  // Conditional truthy check of state or input
  when(state`foo.isAwesome`), {
    true: [],
    false: []
  },

  when(props`foo.isAwesome`), {
    true: [],
    false: []
  }
]
