import Tag from 'cerebral/lib/tags/Tag'
import React from 'react'
import HocFactory from './hoc'
import {connect as reactConnect} from 'cerebral/react'

let PropTypes
const [major, minor] = React.version.split('.')

if ((major === '15' && minor >= 5) || major >= 16) {
  try {
    PropTypes = require('prop-types')
  } catch (e) {
    console.error(
      'In order to support react@15.5+, you need to have prop-types package installed. ' +
      'Please add prop-types to your dependencies (`npm install --save prop-types`)'
    )
    throw e
  }
}

PropTypes = PropTypes || React.PropTypes

export function query (strings, ...values) {
  return new Tag('query', {}, strings, values)
}

export const connect = HocFactory(React, PropTypes, reactConnect)
