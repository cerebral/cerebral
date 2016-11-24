/* eslint-disable */
import { set, unset, toggle } from 'cerebral/operators';

import { state, props } from "cerebral/tags";

export default [
  // Copy
  set(props`bar`, state`foo.bar`),
  set(props`bar`, props`foo`),
  set(state`foo.bar`, props`foo`),
  set(state`bar.baz`, state`foo.bar`),

  // Set state
  set(state`foo.bar`, true),
  set(state`foo.bar`, true),

  // Unset key from object
  unset(state`users.user0`),
  unset(state`users.user0`),

  // Toggle a boolean value in your state
  toggle(state`foo`),
  toggle(state`foo`)
]
