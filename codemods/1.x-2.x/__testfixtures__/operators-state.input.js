/* eslint-disable */
import {
  set,
  copy,
  unset,
  toggle
} from 'cerebral/operators';

export default [
  // Copy
  copy('state:foo.bar', 'output:bar'),
  copy('input:foo', 'output:bar'),
  copy('input:foo', 'state:foo.bar'),
  copy('state:foo.bar', 'state:bar.baz'),

  // Set state
  set('state:foo.bar', true),
  set('foo.bar', true),

  // Unset key from object
  unset('state:users.user0'),
  unset('users.user0'),

  // Toggle a boolean value in your state
  toggle('state:foo'),
  toggle('foo')
]
